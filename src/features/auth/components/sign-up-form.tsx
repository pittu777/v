"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { OAuthStrategy } from "@clerk/nextjs/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialAuthButtons } from "@/features/auth/components/social-auth-buttons";
import { useSignUpFlow } from "@/features/auth/hooks/use-sign-up-flow";

export function SignUpForm() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const flow = useSignUpFlow(emailAddress, password);
  const codeTimer = flow.codeTimer;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (flow.verificationRequired) void flow.verifyEmail(code);
    else void flow.createAccount();
  }

  function startOver() {
    flow.startOver();
    setCode("");
    setEmailAddress("");
    setPassword("");
  }

  const disableSubmit =
    flow.busy ||
    flow.loadingProvider !== null ||
    (flow.verificationRequired && codeTimer.expirySeconds === 0);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {flow.verificationRequired ? "Verify your email" : "Create your account"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {flow.verificationRequired
            ? `Enter the verification code sent to ${emailAddress}.`
            : "Set up an account to manage your vending operations."}
        </p>
      </header>

      <SocialAuthButtons
        onSelect={flow.signUpWithProvider}
        loadingStrategy={flow.loadingProvider}
        disabled={flow.busy}
        visible={!flow.verificationRequired}
      />

      <form className="space-y-4" onSubmit={submit}>
        {!flow.verificationRequired ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.target.value)}
                placeholder="you@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
              />
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Enter the code"
              />
            </div>
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-live="polite">
              <span>
                {codeTimer.expirySeconds > 0
                  ? `Code expires in ${codeTimer.formatTime(codeTimer.expirySeconds)}`
                  : "Code expired. Request a new code."}
              </span>
              <span>
                {codeTimer.resendSeconds > 0
                  ? `Resend available in ${codeTimer.formatTime(codeTimer.resendSeconds)}`
                  : "You can request another code."}
              </span>
            </div>
          </div>
        )}

        {flow.error && <p role="alert" className="text-sm text-destructive">{flow.error}</p>}
        <Button type="submit" className="h-10 w-full" disabled={disableSubmit}>
          {flow.busy ? "Please wait…" : flow.verificationRequired ? "Verify email" : "Create account"}
        </Button>
        {flow.verificationRequired && (
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              disabled={flow.busy || codeTimer.resendSeconds > 0}
              onClick={() => void flow.resendCode()}
            >
              {codeTimer.resendSeconds > 0
                ? `Resend in ${codeTimer.formatTime(codeTimer.resendSeconds)}`
                : "Resend code"}
            </Button>
            <Button type="button" variant="outline" disabled={flow.busy} onClick={startOver}>
              Use a different email
            </Button>
          </div>
        )}
      </form>
      <div id="clerk-captcha" />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-medium text-foreground underline-offset-4 hover:underline" href="/sign-in">
          Sign in
        </Link>
      </p>
    </div>
  );
}
