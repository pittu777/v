"use client";

import { HandleSSOCallback } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SSOCallbackPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-sm text-muted-foreground">
      <HandleSSOCallback
        navigateToApp={({ session, decorateUrl }) => {
          const destination = session?.currentTask ? "/" : decorateUrl("/");
          if (destination.startsWith("http")) window.location.href = destination;
          else router.replace(destination);
        }}
        navigateToSignIn={() => router.replace("/sign-in")}
        navigateToSignUp={() => router.replace("/sign-up")}
      />
      <p>Completing secure sign in…</p>
    </main>
  );
}
