"use client";

import { HandleSSOCallback } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
  const router = useRouter();

  return (
    <main className="grid min-h-svh place-items-center bg-background px-4 py-8">
      <div className="relative w-full max-w-sm rounded-2xl border bg-card px-6 py-8 text-center shadow-sm sm:px-8">
        <HandleSSOCallback
          navigateToApp={({ session, decorateUrl }) => {
            const destination = session?.currentTask ? "/" : decorateUrl("/");
            if (destination.startsWith("http")) window.location.href = destination;
            else router.replace(destination);
          }}
          navigateToSignIn={() => router.replace("/sign-in")}
          navigateToSignUp={() => router.replace("/sign-up")}
        />
        <div role="status" aria-live="polite" className="flex flex-col items-center gap-3">
          <Loader2 aria-hidden="true" className="size-6 animate-spin text-primary motion-reduce:animate-none" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Completing sign in</p>
            <p className="text-sm leading-5 text-muted-foreground">Please wait while we finish setting up your session.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
