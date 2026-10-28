import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MachineStatus } from "@/features/machines/components/MachineStatus";
import { getMyMachines } from "@/features/machines/machine.service";
import { getMyVendor, VendorServiceError } from "@/features/vendors/vendor.service";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { CircleCheck, Monitor, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function VendorDashboardPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Suspense fallback={<DashboardLoading />}>
        <VendorDashboardContent />
      </Suspense>
    </main>
  );
}

function DashboardLoading() {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <span className="sr-only">Loading your vendor dashboard...</span>
      <div aria-hidden="true" className="h-24 animate-pulse rounded-xl bg-muted motion-reduce:animate-none" />
      <div aria-hidden="true" className="grid gap-4 sm:grid-cols-2">
        <div className="h-28 animate-pulse rounded-xl bg-muted motion-reduce:animate-none" />
        <div className="h-28 animate-pulse rounded-xl bg-muted motion-reduce:animate-none" />
      </div>
      <div aria-hidden="true" className="h-64 animate-pulse rounded-xl bg-muted motion-reduce:animate-none" />
    </div>
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

  const machines = await getMyMachines();
  const activeMachineCount = machines.filter((machine) => machine.status === "ACTIVE").length;

  return (
    <div className="space-y-8 lg:space-y-10">
      <header className="flex flex-col gap-5 border-b border-border/80 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Vendor dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Welcome, {vendor.businessName}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Your business profile is ready. Start by registering the vending machines your business owns or operates.
          </p>
        </div>
        <Button nativeButton={false} className="w-full sm:w-auto" render={<Link href="/vendor/machines" />}>
          <Plus aria-hidden="true" />
          Register a machine
        </Button>
      </header>

      <section aria-label="Machine overview" className="grid gap-4 sm:grid-cols-2">
        <SummaryCard icon={Monitor} label="Registered machines" value={machines.length} />
        <SummaryCard icon={CircleCheck} label="Active machines" value={activeMachineCount} />
      </section>

      <section aria-labelledby="recent-machines-title">
        <Card>
          <CardHeader className="grid-cols-[1fr_auto] items-center gap-3">
            <div className="space-y-1">
              <CardTitle id="recent-machines-title">Machines</CardTitle>
              <CardDescription>Your machines and their current status.</CardDescription>
            </div>
            <Button nativeButton={false} variant="ghost" className="shrink-0" render={<Link href="/vendor/machines" />}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {machines.length === 0 ? (
              <div className="rounded-xl border border-dashed bg-muted/20 px-5 py-9 text-center">
                <Monitor aria-hidden="true" className="mx-auto mb-3 size-5 text-muted-foreground" />
                <p className="text-sm font-medium">No machines registered</p>
                <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                  Add a machine to start organizing your vending operations.
                </p>
                <Button className="mt-4" nativeButton={false} variant="outline" render={<Link href="/vendor/machines" />}>
                  Register a machine
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-border/80">
                {machines.slice(0, 5).map((machine) => (
                  <li key={machine.id}>
                    <Link
                      href={`/vendor/machines/${machine.id}`}
                      className="-mx-2 flex flex-col gap-3 rounded-lg px-2 py-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{machine.name}</span>
                        <span className="mt-1 block truncate text-xs text-muted-foreground">
                          {machine.machineCode}{machine.location ? ` · ${machine.location}` : ""}
                        </span>
                      </span>
                      <MachineStatus status={machine.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="business-profile-title" className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle id="business-profile-title">Business profile</CardTitle>
            <CardDescription>Details associated with your vendor account.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-x-8 gap-y-5 border-t border-border/80 pt-5 sm:grid-cols-2">
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

function SummaryCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5 sm:p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Icon aria-hidden="true" className="size-[18px]" />
        </span>
      </CardContent>
    </Card>
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
