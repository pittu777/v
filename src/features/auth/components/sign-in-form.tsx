"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { OAuthStrategy } from "@clerk/nextjs/types";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialAuthButtons } from "@/features/auth/components/social-auth-buttons";

function messageFrom(error: unknown) {
  if (error && typeof error === "object" && "errors" in error) {
    const first = (error as { errors?: { longMessage?: string; message?: string }[] }).errors?.[0];
    if (first) return first.longMessage ?? first.message ?? "Unable to sign in.";
  }
  return error instanceof Error ? error.message : "Unable to sign in. Please try again.";
}

export function SignInForm() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<OAuthStrategy | null>(null);

  async function signInWithProvider(strategy: OAuthStrategy) {
    setError("");
    setLoadingProvider(strategy);
    try {
      const { error: ssoError } = await signIn.sso({
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

  async function finish() {
    await signIn.finalize({
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

  async function submitCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { error: requestError } = await signIn.password({ emailAddress, password });
      if (requestError) throw requestError;
      if (signIn.status === "complete") {
        await finish();
      } else if (signIn.status === "needs_client_trust") {
        const { error: sendError } = await signIn.mfa.sendEmailCode();
        if (sendError) throw sendError;
        setVerificationRequired(true);
      } else {
        setError("Your account requires an additional sign-in step that is not available here. Contact your administrator.");
      }
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setBusy(false);
    }
  }

  async function submitCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { error: verifyError } = await signIn.mfa.verifyEmailCode({ code });
      if (verifyError) throw verifyError;
      if (signIn.status === "complete") await finish();
      else setError("The verification step could not be completed. Check the code and try again.");
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{verificationRequired ? "Verify your sign in" : "Welcome back"}</h1>
        <p className="text-sm text-muted-foreground">
          {verificationRequired ? "Enter the email verification code sent to your account." : "Sign in to manage your vending operations."}
        </p>
      </header>

      <SocialAuthButtons
        onSelect={signInWithProvider}
        loadingStrategy={loadingProvider}
        disabled={fetchStatus === "fetching" || busy}
        visible={!verificationRequired}
      />

      <form className="space-y-4" onSubmit={verificationRequired ? submitCode : submitCredentials}>
        {!verificationRequired ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" autoComplete="email" required value={emailAddress} onChange={(event) => setEmailAddress(event.target.value)} placeholder="you@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="code">Verification code</Label>
            <Input id="code" inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={(event) => setCode(event.target.value)} placeholder="Enter the code" />
          </div>
        )}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="h-10 w-full" disabled={fetchStatus === "fetching" || busy || loadingProvider !== null}>
          {busy ? "Please wait…" : verificationRequired ? "Verify and sign in" : "Sign in"}
        </Button>
        {verificationRequired && <Button type="button" variant="outline" className="w-full" onClick={() => { setVerificationRequired(false); setCode(""); setError(""); }}>Back to sign in</Button>}
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New to Vendor? <Link className="font-medium text-foreground underline-offset-4 hover:underline" href="/sign-up">Create an account</Link>
      </p>
    </div>
  );
}
