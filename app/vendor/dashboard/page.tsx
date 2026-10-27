import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutControl } from "@/features/auth/components/SignOutControl";
import { getMyVendor, VendorServiceError } from "@/features/vendors/vendor.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

export default function VendorDashboardPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<DashboardLoading />}>
        <VendorDashboardContent />
      </Suspense>
    </main>
  );
}

function DashboardLoading() {
  return (
    <Card>
      <CardContent className="p-6 text-sm text-muted-foreground">
        Loading your vendor dashboard…
      </CardContent>
    </Card>
  );
}

async function VendorDashboardContent() {
  // Clerk auth and profile data are request-specific. Do not evaluate them while prerendering.
  await connection();

  let vendor: Awaited<ReturnType<typeof getMyVendor>>;
  try {
    vendor = await getMyVendor();
  } catch (error) {
    if (error instanceof VendorServiceError && error.code === "NOT_FOUND") {
      redirect("/vendor/onboarding");
    }
    throw error;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Vendor dashboard
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome, {vendor.businessName}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Your business profile is ready. Start by registering the vending machines your business owns or operates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button nativeButton={false} variant="outline" render={<Link href="/vendor/machines" />}>
            Manage machines
          </Button>
          <Button nativeButton={false} variant="outline" render={<Link href="/" />}>
            Open inventory
          </Button>
          <SignOutControl />
        </div>
      </header>

      <section aria-labelledby="business-profile-title" className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle id="business-profile-title">Business profile</CardTitle>
            <CardDescription>Details associated with your vendor account.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <ProfileDetail label="Business name" value={vendor.businessName} />
              <ProfileDetail label="Contact person" value={vendor.contactPerson} />
              <ProfileDetail label="Business email" value={vendor.businessEmail} />
            </dl>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ProfileDetail({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="space-y-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="break-words text-sm font-medium">{value || "Not provided"}</dd>
    </div>
  );
}
