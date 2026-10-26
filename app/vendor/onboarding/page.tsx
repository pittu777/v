import { VendorOnboardingForm } from "@/features/vendors/components/VendorOnboardingForm";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function VendorOnboardingPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-6 py-16">
      <Suspense
        fallback={
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-zinc-600">Loading your vendor profile…</p>
          </div>
        }
      >
        <VendorOnboardingContent />
      </Suspense>
    </main>
  );
}

async function VendorOnboardingContent() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const vendor = await prisma.vendor.findUnique({
    where: { clerkId: userId },
    select: { businessName: true },
  });

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
        Vendor onboarding
      </p>
      <h1 className="mt-2 text-2xl font-bold text-zinc-950">
        Set up your vendor profile
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        Create the business profile that will own or operate your vending
        machines.
      </p>

      <div className="mt-8">
        {vendor ? (
          <div className="rounded-lg bg-emerald-50 p-4 text-emerald-950">
            <h2 className="font-semibold">Your profile is set up</h2>
            <p className="mt-1">{vendor.businessName}</p>
          </div>
        ) : (
          <VendorOnboardingForm />
        )}
      </div>
    </div>
  );
}
