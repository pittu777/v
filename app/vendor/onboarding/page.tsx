import { VendorOnboardingForm } from "@/features/vendors/components/VendorOnboardingForm";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VendorOnboardingPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100svh-7rem)] w-full max-w-3xl items-center px-4 py-10 sm:px-6 lg:min-h-[calc(100svh-4rem)] lg:py-12">
      <Suspense
        fallback={
          <Card className="w-full">
            <CardContent className="p-6 sm:p-8">
              <p className="text-sm text-muted-foreground">Loading your vendor profile…</p>
            </CardContent>
          </Card>
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
    select: { id: true },
  });

  if (vendor) {
    redirect("/vendor/dashboard");
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-3 p-6 sm:p-8 sm:pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Vendor onboarding
        </p>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Set up your business profile
          </CardTitle>
          <CardDescription className="max-w-xl text-sm leading-6">
            Add the details used to identify your business and manage the vending machines you own or operate.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
        <div className="border-t pt-6">
          <VendorOnboardingForm />
        </div>
      </CardContent>
    </Card>
  );
}
