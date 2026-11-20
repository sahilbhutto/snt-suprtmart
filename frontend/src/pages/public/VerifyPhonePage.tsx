
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LuCheck, LuInfo, LuLock, LuSmartphone } from "react-icons/lu";

import Button from "../../components/ui/Button";

import {
  AuthError,
  cancelVerification,
  getChallengeInfo,
  resendPhoneCode,
  verifyPhoneCode,
} from "../../features/auth/api/auth.api";

import AuthShell from "../../features/auth/components/AuthShell";
import AuthStepper from "../../features/auth/components/AuthStepper";
import OtpInput from "../../features/auth/components/OtpInput";

import { useSecondsUntil } from "../../features/auth/hooks/useSecondsUntil";
import { OTP_LENGTH } from "../../features/auth/lib/authConfig";
import { useAuthStore } from "../../features/auth/store/authStore";

import type { ChallengeInfo } from "../../features/auth/types/auth.types";

const mmss = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

type Status = "idle" | "verifying" | "success";

const VerifyPhonePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: string } | null)?.from ?? "/";

  const signIn = useAuthStore((s) => s.signIn);

  // State
  const [info, setInfo] = useState<ChallengeInfo | null>(
    () => getChallengeInfo()
  );

  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [resending, setResending] = useState(false);
  const [locked, setLocked] = useState(false);
  const [round, setRound] = useState(0);

  // Timers
  const expiresIn = useSecondsUntil(info?.expiresAt ?? null);
  const resendIn = useSecondsUntil(info?.nextResendAt ?? null);

  const isLogin = info?.purpose === "login";
  const expired = expiresIn === 0;

  // Page title
  useEffect(() => {
    document.title = "Verify your phone | SNT Supermart";
  }, []);

  // Redirect after successful verification
  useEffect(() => {
    if (status !== "success") return;

    const id = window.setTimeout(() => {
      navigate(from, { replace: true });
    }, 1600);

    return () => window.clearTimeout(id);
  }, [status, from, navigate]);

  // Redirect if verification challenge is unavailable
  if (!info && status !== "success") {
    return <Navigate to="/login" replace />;
  }

  // Verify OTP
  const verify = async (value: string) => {
    if (
      status === "verifying" ||
      status === "success" ||
      locked ||
      expired ||
      value.length !== OTP_LENGTH
    ) {
      return;
    }

    setError(null);
    setNotice(null);
    setStatus("verifying");

    try {
      const user = await verifyPhoneCode(value);

      if (import.meta.env.DEV) {
        console.log("[verify_phone] verified:", {
          id: user.id,
          is_verify: user.is_verify,
        });
      }

      // Sign in only after successful verification
      signIn(user);
      setStatus("success");
    } catch (e) {
      setStatus("idle");
      setCode("");
      setRound((r) => r + 1);

      if (e instanceof AuthError) {
        setError(e.message);

        if (e.code === "TOO_MANY_ATTEMPTS") {
          setLocked(true);
        }

        setInfo(getChallengeInfo());
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  // Resend OTP
  const resend = async () => {
    if (resending || resendIn > 0 || locked) return;

    setResending(true);
    setError(null);
    setNotice(null);

    try {
      const next = await resendPhoneCode();

      setInfo(next);
      setCode("");
      setRound((r) => r + 1);

      setNotice("A new code has been sent.");
    } catch (e) {
      if (e instanceof AuthError) {
        setError(e.message);

        if (e.code === "TOO_MANY_ATTEMPTS") {
          setLocked(true);
        }
      } else {
        setError("We could not send a new code. Please try again.");
      }

      setInfo(getChallengeInfo());
    } finally {
      setResending(false);
    }
  };

  // Change phone number
  const changeNumber = () => {
    cancelVerification();

    navigate(isLogin ? "/login" : "/register", {
      replace: true,
      state: location.state,
    });
  };

  // Success screen
  if (status === "success") {
    return (
      <AuthShell>
        <div className="grid justify-items-center gap-5 py-10 text-center">
          <span className="grid size-24 place-items-center rounded-full bg-success text-background shadow-[0_0_0_14px_rgb(21_128_61/0.12)] animate-pop">
            <LuCheck size={48} strokeWidth={3} />
          </span>

          <div className="grid gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {isLogin ? "Welcome back!" : "Phone verified!"}
            </h1>

            <p className="text-muted-foreground">
              {isLogin
                ? "You are signed in. Taking you back..."
                : "Your account is ready. Taking you back..."}
            </p>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      {/* Registration progress */}
      {!isLogin && <AuthStepper current={2} />}

      {/* Header */}
      <header className="grid justify-items-start gap-4">
        <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-link">
          <LuSmartphone size={28} />
        </span>

        <div className="grid gap-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {isLogin ? "Enter your code" : "Verify your phone"}
          </h1>

          <p className="text-muted-foreground">
            Enter the {OTP_LENGTH}-digit code we sent by SMS to{" "}
            <b className="text-foreground">{info?.phoneMasked}</b>.
          </p>
        </div>
      </header>

      {/* Verification locked */}
      {locked ? (
        <div className="grid gap-4 rounded-2xl bg-danger-soft p-5">
          <p
            role="alert"
            className="flex items-start gap-2.5 text-sm font-semibold text-danger"
          >
            <LuInfo size={18} className="mt-px shrink-0" />
            {error ?? "Too many incorrect attempts. Please start again."}
          </p>

          <Button
            type="button"
            onClick={changeNumber}
            className="w-full sm:w-max"
          >
            Start again
          </Button>
        </div>
      ) : (
        <div className="grid gap-5">
          {/* OTP Input */}
          <OtpInput
            key={round}
            length={OTP_LENGTH}
            value={code}
            onChange={setCode}
            onComplete={verify}
            disabled={status === "verifying" || expired}
            hasError={!!error}
            autoFocus
          />

          {/* Error and success messages */}
          <div
            aria-live="polite"
            className="grid gap-2 text-sm"
          >
            {error && (
              <p
                role="alert"
                className="flex items-start gap-2 font-semibold text-danger"
              >
                <LuInfo size={16} className="mt-0.5 shrink-0" />
                {error}
              </p>
            )}

            {notice && (
              <p className="font-semibold text-success">
                {notice}
              </p>
            )}
          </div>

          {/* OTP expiration and attempts */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {expired
                ? "This code has expired"
                : `Code expires in ${mmss(expiresIn)}`}
            </span>

            <span>
              {info?.attemptsLeft}{" "}
              {info?.attemptsLeft === 1 ? "attempt" : "attempts"} left
            </span>
          </div>

          {/* Verify button */}
          <Button
            type="button"
            size="lg"
            onClick={() => verify(code)}
            disabled={
              code.length !== OTP_LENGTH ||
              status === "verifying" ||
              expired
            }
            className="min-h-14 w-full text-base"
          >
            {status === "verifying" ? (
              <>
                <span
                  aria-hidden
                  className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
                Verifying...
              </>
            ) : isLogin ? (
              "Sign in"
            ) : (
              "Verify and continue"
            )}
          </Button>

          {/* Resend and change number */}
          <div className="grid gap-3 text-center text-sm">
            <p className="text-muted-foreground">
              Did not get the code?{" "}

              {resendIn > 0 ? (
                <span className="font-bold text-foreground">
                  Resend in {mmss(resendIn)}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={resend}
                  disabled={resending}
                  className="font-bold text-link hover:underline disabled:opacity-60"
                >
                  {resending ? "Sending..." : "Resend code"}
                </button>
              )}
            </p>

            <button
              type="button"
              onClick={changeNumber}
              className="mx-auto w-max font-bold text-link hover:underline"
            >
              Wrong number? Change it
            </button>
          </div>
        </div>
      )}

      {/* Security information */}
      <div className="grid gap-3 rounded-2xl bg-surface-muted p-4 text-xs text-muted-foreground">
        <p className="flex items-start gap-2.5">
          <LuLock size={14} className="mt-px shrink-0 text-link" />

          Never share this code with anyone, including SNT Supermart staff.
          We will never ask for it.
        </p>

        {import.meta.env.DEV && (
          <p className="rounded-lg bg-warning-soft p-2.5 font-semibold text-warning">
            Development mode: no SMS is sent. Open the browser console to see
            the code.
          </p>
        )}
      </div>
    </AuthShell>
  );
};

export default VerifyPhonePage;
