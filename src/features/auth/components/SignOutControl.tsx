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
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Sign out
        </button>
      </SignOutButton>
    </Show>
  );
}
