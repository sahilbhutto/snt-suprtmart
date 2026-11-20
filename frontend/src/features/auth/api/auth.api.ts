import { maskPhone } from "../../../lib/phone";
import {
  OTP_LENGTH,
  OTP_MAX_ATTEMPTS,
  OTP_MAX_RESENDS,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_TTL_SECONDS,
} from "../lib/authConfig";
import type { AuthErrorCode, AuthPurpose, AuthUser, ChallengeInfo, RegisterRequest } from "../types/auth.types";

/**
 * MOCK SERVER. Replace with real endpoints:
 *   POST /api/auth/register     -> registerAccount
 *   POST /api/auth/verify-phone -> verifyPhoneCode
 *   POST /api/auth/resend-otp   -> resendPhoneCode
 * The real server stores only a hash of the code and sets the session in an httpOnly cookie.
 */

const USERS_KEY = "snt-mock-users";
const CHALLENGE_KEY = "snt-mock-challenge";
const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

interface StoredUser {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  marketingOptIn: boolean;
  acceptedTermsAt: string;
  is_verify: boolean;
  createdAt: string;
}

interface Challenge {
  purpose: AuthPurpose;
  userId: string;
  phone: string;
  otp: string;
  expiresAt: number;
  nextResendAt: number;
  attempts: number;
  resends: number;
}

export class AuthError extends Error {
  code: AuthErrorCode;
  meta?: { attemptsLeft?: number; retryAfter?: number };

  constructor(code: AuthErrorCode, message: string, meta?: { attemptsLeft?: number; retryAfter?: number }) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.meta = meta;
  }
}

/* ---------- storage helpers ---------- */

const readUsers = (): StoredUser[] => {
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
};
const writeUsers = (users: StoredUser[]) => {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* ignore */
  }
};
const readChallenge = (): Challenge | null => {
  try {
    const raw = window.sessionStorage.getItem(CHALLENGE_KEY);
    return raw ? (JSON.parse(raw) as Challenge) : null;
  } catch {
    return null;
  }
};
const writeChallenge = (c: Challenge) => {
  try {
    window.sessionStorage.setItem(CHALLENGE_KEY, JSON.stringify(c));
  } catch {
    /* ignore */
  }
};
const clearChallenge = () => {
  try {
    window.sessionStorage.removeItem(CHALLENGE_KEY);
  } catch {
    /* ignore */
  }
};

/* ---------- helpers ---------- */

const generateOtp = () => {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
  return String(n % 10 ** OTP_LENGTH).padStart(OTP_LENGTH, "0");
};

const newChallenge = (user: StoredUser, resends: number, purpose: AuthPurpose): Challenge => {
  const now = Date.now();
  const challenge: Challenge = {
    purpose,
    userId: user.id,
    phone: user.phone,
    otp: generateOtp(),
    expiresAt: now + OTP_TTL_SECONDS * 1000,
    nextResendAt: now + OTP_RESEND_COOLDOWN_SECONDS * 1000,
    attempts: 0,
    resends,
  };
  writeChallenge(challenge);

  // There is no SMS provider yet. Development only: never log codes in production
  if (import.meta.env.DEV) console.info(`[DEV ONLY] OTP for ${user.phone}: ${challenge.otp}`);
  return challenge;
};

const toInfo = (c: Challenge): ChallengeInfo => ({
  purpose: c.purpose,
  phoneMasked: maskPhone(c.phone),
  expiresAt: c.expiresAt,
  nextResendAt: c.nextResendAt,
  attemptsLeft: Math.max(0, OTP_MAX_ATTEMPTS - c.attempts),
  resendsLeft: Math.max(0, OTP_MAX_RESENDS - c.resends),
});

const toAuthUser = (u: StoredUser): AuthUser => ({
  id: u.id,
  fullName: u.fullName,
  phone: u.phone,
  email: u.email,
  is_verify: u.is_verify,
  createdAt: u.createdAt,
});

/* ---------- public API ---------- */

/** Non-secret details of the code that is waiting to be verified (null when there is none) */
export const getChallengeInfo = (): ChallengeInfo | null => {
  const c = readChallenge();
  return c ? toInfo(c) : null;
};

/** Creates the account with is_verify = false and sends a code to the phone number */
export const registerAccount = async (req: RegisterRequest): Promise<ChallengeInfo> => {
  await wait(900);

  const users = readUsers();
  const existing = users.find((u) => u.phone === req.phone);
  if (existing?.is_verify) {
    throw new AuthError("PHONE_EXISTS", "This mobile number is already registered. Please sign in.");
  }

  const now = new Date().toISOString();
  const user: StoredUser = {
    id: existing?.id ?? `user-${Date.now().toString(36)}`,
    fullName: req.fullName,
    phone: req.phone,
    email: req.email,
    marketingOptIn: req.marketingOptIn,
    acceptedTermsAt: now,
    is_verify: false, // always false until the code is confirmed
    createdAt: existing?.createdAt ?? now,
  };
  writeUsers([...users.filter((u) => u.id !== user.id), user]);

  return toInfo(newChallenge(user, 0, "register"));
};

/** Starts a sign-in: sends a code to an existing account. POST /api/auth/login-otp on a real server */
export const requestLoginCode = async (phone: string): Promise<ChallengeInfo> => {
  await wait(900);

  const user = readUsers().find((u) => u.phone === phone);
  if (!user) throw new AuthError("NO_ACCOUNT", "We could not find an account with this number.");

  // No new code until the cooldown of the active one has finished
  const active = readChallenge();
  if (active && active.phone === phone) {
    const waitSeconds = Math.ceil((active.nextResendAt - Date.now()) / 1000);
    if (waitSeconds > 0) {
      throw new AuthError("RESEND_TOO_SOON", `Please wait ${waitSeconds} seconds before asking for a new code.`, {
        retryAfter: waitSeconds,
      });
    }
  }

  return toInfo(newChallenge(user, 0, "login"));
};

/** Checks the code. On success the account becomes verified and is returned */
export const verifyPhoneCode = async (code: string): Promise<AuthUser> => {
  await wait(700);

  const c = readChallenge();
  if (!c) throw new AuthError("NO_PENDING", "Your verification has expired. Please register again.");
  if (c.attempts >= OTP_MAX_ATTEMPTS) {
    throw new AuthError("TOO_MANY_ATTEMPTS", "Too many incorrect attempts. Please start again.");
  }
  if (Date.now() > c.expiresAt) {
    throw new AuthError("CODE_EXPIRED", "This code has expired. Request a new one.");
  }

  if (code !== c.otp) {
    c.attempts += 1;
    writeChallenge(c);
    const left = OTP_MAX_ATTEMPTS - c.attempts;
    if (left <= 0) throw new AuthError("TOO_MANY_ATTEMPTS", "Too many incorrect attempts. Please start again.");
    throw new AuthError("INVALID_CODE", `Incorrect code. ${left} ${left === 1 ? "attempt" : "attempts"} left.`, {
      attemptsLeft: left,
    });
  }

  const users = readUsers();
  const user = users.find((u) => u.id === c.userId);
  if (!user) throw new AuthError("NO_PENDING", "Your verification has expired. Please register again.");

  user.is_verify = true; // only the server does this, after the code matches
  writeUsers(users);
  clearChallenge();
  return toAuthUser(user);
};

/** Sends a new code. Limited by a cooldown and a maximum number of resends */
export const resendPhoneCode = async (): Promise<ChallengeInfo> => {
  await wait(700);

  const c = readChallenge();
  if (!c) throw new AuthError("NO_PENDING", "Your verification has expired. Please register again.");
  if (c.attempts >= OTP_MAX_ATTEMPTS) {
    throw new AuthError("TOO_MANY_ATTEMPTS", "Too many incorrect attempts. Please start again.");
  }

  const wait_s = Math.ceil((c.nextResendAt - Date.now()) / 1000);
  if (wait_s > 0) {
    throw new AuthError("RESEND_TOO_SOON", `Please wait ${wait_s} seconds before asking for a new code.`, { retryAfter: wait_s });
  }
  if (c.resends >= OTP_MAX_RESENDS) {
    throw new AuthError("RESEND_LIMIT", "You have reached the limit for new codes. Please try again later.");
  }

  const user = readUsers().find((u) => u.id === c.userId);
  if (!user) throw new AuthError("NO_PENDING", "Your verification has expired. Please register again.");

  return toInfo(newChallenge(user, c.resends + 1, c.purpose));
};

/** Used by "Change number" */
export const cancelVerification = () => clearChallenge();
