"use client";

import { Show, SignOutButton, useSignUp } from "@clerk/nextjs";

export function SignOutControl() {
  const { signUp } = useSignUp();

  return (
    <Show when="signed-in">
      <SignOutButton redirectUrl="/sign-in">
        <button
          type="button"
          onClick={() => signUp.reset()}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-background px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Sign out
        </button>
      </SignOutButton>
    </Show>
  );
}
