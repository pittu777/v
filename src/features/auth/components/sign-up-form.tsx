"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function messageFrom(error: unknown) {
  if (error && typeof error === "object" && "errors" in error) {
    const first = (error as { errors?: { longMessage?: string; message?: string }[] }).errors?.[0];
    if (first) return first.longMessage ?? first.message ?? "Unable to create your account.";
  }
  return error instanceof Error ? error.message : "Unable to create your account. Please try again.";
}

function timerStorageKey(emailAddress: string) {
  return `vendor-sign-up-code:${emailAddress.trim().toLowerCase()}`;
}

export function SignUpForm() {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const verificationRequired =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(null);
  const [codeExpiresAt, setCodeExpiresAt] = useState<number | null>(null);
  // Keep the initial render deterministic; Next prerenders Client Components.
  const [clockNow, setClockNow] = useState(0);
  const resendSeconds = resendAvailableAt
    ? Math.max(0, Math.ceil((resendAvailableAt - clockNow) / 1000))
    : 0;
  const expirySeconds = codeExpiresAt
    ? Math.max(0, Math.ceil((codeExpiresAt - clockNow) / 1000))
    : 0;

  function startCodeTimers() {
    const now = Date.now();
    // Clerk verification codes are valid for 10 minutes. Keep the resend
    // button disabled for 30 seconds after a code is sent.
    const deadlines = {
      resendAvailableAt: now + 30_000,
      codeExpiresAt: now + 10 * 60_000,
    };
    setClockNow(now);
    setResendAvailableAt(deadlines.resendAvailableAt);
    setCodeExpiresAt(deadlines.codeExpiresAt);
    try {
      sessionStorage.setItem(timerStorageKey(emailAddress), JSON.stringify(deadlines));
    } catch {
      // The form can still use the countdown for this page if storage is blocked.
    }
  }

  function clearCodeTimers() {
    try {
      if (emailAddress) sessionStorage.removeItem(timerStorageKey(emailAddress));
    } catch {
      // Clearing in-memory state still lets the user restart verification.
    }
    setResendAvailableAt(null);
    setCodeExpiresAt(null);
  }

  async function signUpWithGoogle() {
    setError("");
    setGoogleBusy(true);
    try {
      const { error: ssoError } = await signUp.sso({
        strategy: "oauth_google",
        redirectUrl: "/",
        redirectCallbackUrl: "/sso-callback",
      });
      if (ssoError) throw ssoError;
    } catch (cause) {
      setError(messageFrom(cause));
      setGoogleBusy(false);
    }
  }

  async function finish() {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          setError("Your account requires an additional setup step. Please contact your administrator.");
          return;
        }
        const url = decorateUrl("/");
        if (url.startsWith("http")) window.location.href = url;
        else router.replace(url);
      },
    });
  }

  async function createAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      // Clerk keeps its sign-up attempt across client-side navigation. Start
      // with a clean attempt so a previous account's verification can't leak
      // into this one.
      clearCodeTimers();
      signUp.reset();
      const { error: createError } = await signUp.password({ emailAddress, password });
      if (createError) throw createError;
      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) throw sendError;
      startCodeTimers();
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setBusy(false);
    }
  }

  async function verifyEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });
      if (verifyError) throw verifyError;
      if (signUp.status === "complete") {
        clearCodeTimers();
        await finish();
      }
      else setError("The account setup needs another step. Please contact your administrator.");
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    if (resendSeconds > 0 || busy) return;
    setError("");
    setBusy(true);
    try {
      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) throw sendError;
      startCodeTimers();
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setBusy(false);
    }
  }



  function startOver() {
    signUp.reset();
    setCode("");
    clearCodeTimers();
    setEmailAddress("");
    setPassword("");
    setError("");
  }

  useEffect(() => {
    if (!verificationRequired) return;
    setClockNow(Date.now());

    if (codeExpiresAt === null && emailAddress) {
      try {
        const saved = sessionStorage.getItem(timerStorageKey(emailAddress));
        if (saved) {
          const deadlines = JSON.parse(saved) as {
            resendAvailableAt?: number;
            codeExpiresAt?: number;
          };
          if (typeof deadlines.codeExpiresAt === "number") {
            setCodeExpiresAt(deadlines.codeExpiresAt);
            setResendAvailableAt(deadlines.resendAvailableAt ?? null);
          }
        }
      } catch {
        // Verification remains available; resending starts a fresh timer.
      }
    }

    if (!codeExpiresAt || codeExpiresAt <= Date.now()) return;
    const interval = window.setInterval(() => {
      const now = Date.now();
      setClockNow(now);
      if (now >= codeExpiresAt) window.clearInterval(interval);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [verificationRequired, codeExpiresAt, emailAddress]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{verificationRequired ? "Verify your email" : "Create your account"}</h1>
        <p className="text-sm text-muted-foreground">
          {verificationRequired ? `Enter the verification code sent to ${emailAddress}.` : "Set up an account to manage your vending operations."}
        </p>
      </header>

      {!verificationRequired && (
        <>
          <Button type="button" variant="outline" className="h-10 w-full" disabled={fetchStatus === "fetching" || busy || googleBusy} onClick={signUpWithGoogle}>
            <span aria-hidden="true" className="mr-2 font-semibold">G</span>
            {googleBusy ? "Connecting to Google…" : "Continue with Google"}
          </Button>
          <div className="relative flex items-center">
            <div className="w-full border-t" />
            <span className="absolute left-1/2 -translate-x-1/2 bg-background px-3 text-xs text-muted-foreground">or continue with email</span>
          </div>
        </>
      )}

      <form className="space-y-4" onSubmit={verificationRequired ? verifyEmail : createAccount}>
        {!verificationRequired ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" autoComplete="email" required value={emailAddress} onChange={(event) => setEmailAddress(event.target.value)} placeholder="you@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" />
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="code">Verification code</Label>
              <Input id="code" inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={(event) => setCode(event.target.value)} placeholder="Enter the code" />
            </div>
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-live="polite">
              <span>{expirySeconds > 0 ? `Code expires in ${formatTime(expirySeconds)}` : "Code expired. Request a new code."}</span>
              <span>{resendSeconds > 0 ? `Resend available in ${formatTime(resendSeconds)}` : "You can request another code."}</span>
            </div>
          </div>
        )}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="h-10 w-full" disabled={fetchStatus === "fetching" || busy || googleBusy || (verificationRequired && expirySeconds === 0)}>
          {busy ? "Please wait…" : verificationRequired ? "Verify email" : "Create account"}
        </Button>
        {verificationRequired && (
          <div className="grid gap-2 sm:grid-cols-2">
            <Button type="button" variant="outline" disabled={busy || resendSeconds > 0} onClick={resendCode}>
              {resendSeconds > 0 ? `Resend in ${formatTime(resendSeconds)}` : "Resend code"}
            </Button>
            <Button type="button" variant="outline" disabled={busy} onClick={startOver}>Use a different email</Button>
          </div>
        )}
      </form>
      <div id="clerk-captcha" />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account? <Link className="font-medium text-foreground underline-offset-4 hover:underline" href="/sign-in">Sign in</Link>
      </p>
    </div>
  );
}
