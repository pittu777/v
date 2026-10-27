import { SignInForm } from "@/features/auth/components/sign-in-form";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <Suspense fallback={<AuthPageFallback />}>
      <SignInContent />
    </Suspense>
  );
}

async function SignInContent() {
  await connection();
  const { userId } = await auth();

  if (userId) {
    const vendor = await prisma.vendor.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });
    redirect(vendor ? "/vendor/dashboard" : "/vendor/onboarding");
  }

  return <SignInForm />;
}

function AuthPageFallback() {
  return (
    <div role="status" aria-live="polite" className="space-y-4 py-2">
      <span className="sr-only">Checking your sign-in status…</span>
      <div aria-hidden="true" className="h-3 w-28 animate-pulse rounded bg-muted motion-reduce:animate-none" />
      <div aria-hidden="true" className="h-8 w-2/3 animate-pulse rounded bg-muted motion-reduce:animate-none" />
      <div aria-hidden="true" className="h-4 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
      <div aria-hidden="true" className="h-11 w-full animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />
    </div>
  );
}
