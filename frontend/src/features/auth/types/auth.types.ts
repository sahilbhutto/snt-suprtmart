
export interface RegisterValues {
  fullName: string;
  phone: string; // typed as 300 1234567
  email: string; // optional
  referralCode: string; // optional
  acceptTerms: boolean;
  marketingOptIn: boolean;
  /** Hidden honeypot field. Real people never fill it, bots do */
  website: string;
}

/** What the browser sends to the server */
export interface RegisterRequest {
  fullName: string;
  phone: string; // normalised: 03001234567
  email?: string;
  referralCode?: string;
  marketingOptIn: boolean;
  acceptedTerms: true;
}

export type AuthPurpose = "register" | "login";

export interface LoginValues {
  phone: string; // typed as 300 1234567
  /** Hidden honeypot field. Real people never fill it, bots do */
  website: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  /** false until the phone number is verified with the code. Only the server can set it to true */
  is_verify: boolean;
  createdAt: string; // ISO 8601
}

/** Non-secret details about the code that was sent. The code itself is never returned */
export interface ChallengeInfo {
  purpose: AuthPurpose;
  phoneMasked: string;
  expiresAt: number; // ms timestamp
  nextResendAt: number; // ms timestamp
  attemptsLeft: number;
  resendsLeft: number;
}

export type AuthErrorCode =
  | "PHONE_EXISTS"
  | "NO_ACCOUNT"
  | "INVALID_CODE"
  | "CODE_EXPIRED"
  | "TOO_MANY_ATTEMPTS"
  | "RESEND_TOO_SOON"
  | "RESEND_LIMIT"
  | "NO_PENDING";
