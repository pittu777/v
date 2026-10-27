"use client";

import { useState } from "react";
import type { FormEvent } from "react";
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
    <div className="space-y-7">
      <header className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Vendor workspace</p>
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.035em]">
          {flow.verificationRequired ? "Verify your email" : "Create your account"}
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          {flow.verificationRequired ? (
            <>Enter the verification code sent to <span className="font-medium text-foreground">{emailAddress}</span>.</>
          ) : (
            "Create an account to organize and manage your vending operation."
          )}
        </p>
      </header>

      <SocialAuthButtons
        onSelect={flow.signUpWithProvider}
        loadingStrategy={flow.loadingProvider}
        disabled={flow.busy}
        visible={!flow.verificationRequired}
      />

      <form className="space-y-5" onSubmit={submit}>
        {!flow.verificationRequired ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.target.value)}
                placeholder="name@company.com"
                className="h-11 rounded-lg bg-background px-3 shadow-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                className="h-11 rounded-lg bg-background px-3 shadow-none"
              />
              <p className="text-xs leading-5 text-muted-foreground">Use at least 8 characters.</p>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium">Verification code</Label>
              <Input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Enter the code"
                className="h-11 rounded-lg bg-background px-3 text-center font-mono tracking-[0.25em] shadow-none"
              />
            </div>
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-2 rounded-lg bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground" aria-live="polite">
              <span>
                {codeTimer.expirySeconds > 0
                  ? `Code expires in ${codeTimer.formatTime(codeTimer.expirySeconds)}`
                  : "Code expired. Request a new code."}
              </span>
              <span className="sm:ml-auto sm:text-right">
                {codeTimer.resendSeconds > 0
                  ? `Resend available in ${codeTimer.formatTime(codeTimer.resendSeconds)}`
                  : "You can request another code."}
              </span>
            </div>
          </div>
        )}

        {flow.error && <p role="alert" aria-live="assertive" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm leading-5 text-destructive">{flow.error}</p>}
        <Button type="submit" className="h-11 w-full rounded-lg font-semibold" disabled={disableSubmit}>
          {flow.busy ? "Please wait…" : flow.verificationRequired ? "Verify email" : "Create account"}
        </Button>
        {flow.verificationRequired && (
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-lg"
              disabled={flow.busy || codeTimer.resendSeconds > 0}
              onClick={() => void flow.resendCode()}
            >
              {codeTimer.resendSeconds > 0
                ? `Resend in ${codeTimer.formatTime(codeTimer.resendSeconds)}`
                : "Resend code"}
            </Button>
            <Button type="button" variant="outline" className="h-11 rounded-lg" disabled={flow.busy} onClick={startOver}>
              Use a different email
            </Button>
          </div>
        )}
      </form>
      <div id="clerk-captcha" />

      <p className="border-t pt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-semibold text-foreground underline-offset-4 hover:underline" href="/sign-in">
          Sign in
        </Link>
      </p>
    </div>
  );
}
