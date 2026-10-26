"use client";

import type { OAuthStrategy } from "@clerk/nextjs/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useEmailCodeTimer } from "@/features/auth/hooks/use-email-code-timer";

function messageFrom(error: unknown) {
  if (error && typeof error === "object" && "errors" in error) {
    const first = (error as { errors?: { longMessage?: string; message?: string }[] }).errors?.[0];
    if (first) return first.longMessage ?? first.message ?? "Unable to create your account.";
  }
  return error instanceof Error ? error.message : "Unable to create your account. Please try again.";
}

export function useSignUpFlow(emailAddress: string, password: string) {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<OAuthStrategy | null>(null);
  const verificationRequired =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;
  const codeTimer = useEmailCodeTimer(emailAddress, verificationRequired);

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

  async function signUpWithProvider(strategy: OAuthStrategy) {
    setError("");
    setLoadingProvider(strategy);
    try {
      const { error: ssoError } = await signUp.sso({
        strategy,
        redirectUrl: "/",
        redirectCallbackUrl: "/sso-callback",
      });
      if (ssoError) throw ssoError;
    } catch (cause) {
      setError(messageFrom(cause));
      setLoadingProvider(null);
    }
  }

  async function createAccount() {
    setError("");
    setBusy(true);
    try {
      // Clerk keeps sign-up attempts across client-side navigation.
      codeTimer.clear();
      signUp.reset();
      const { error: createError } = await signUp.password({ emailAddress, password });
      if (createError) throw createError;

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) throw sendError;
      codeTimer.start();
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setBusy(false);
    }
  }

  async function verifyEmail(code: string) {
    setError("");
    setBusy(true);
    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });
      if (verifyError) throw verifyError;
      if (signUp.status === "complete") {
        codeTimer.clear();
        await finish();
      } else {
        setError("The account setup needs another step. Please contact your administrator.");
      }
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    if (codeTimer.resendSeconds > 0 || busy) return;
    setError("");
    setBusy(true);
    try {
      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) throw sendError;
      codeTimer.start();
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setBusy(false);
    }
  }

  function startOver() {
    signUp.reset();
    codeTimer.clear();
    setError("");
  }

  return {
    verificationRequired,
    busy: busy || fetchStatus === "fetching",
    error,
    codeTimer,
    loadingProvider,
    signUpWithProvider,
    createAccount,
    verifyEmail,
    resendCode,
    startOver,
  };
}
