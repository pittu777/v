"use client";

import { Show, SignOutButton } from "@clerk/nextjs";

export function SignOutControl() {
  return (
    <Show when="signed-in">
      <SignOutButton redirectUrl="/sign-in">
        <button
          type="button"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Sign out
        </button>
      </SignOutButton>
    </Show>
  );
}
