import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { getMyMachines, MachineServiceError } from "@/features/machines/machine.service";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { MachineForm } from "@/features/machines/components/MachineForm";
import { Monitor } from "lucide-react";
import { MachineStatus } from "@/features/machines/components/MachineStatus";

export default function VendorMachinesPage() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Suspense fallback={<MachinesLoading />}>
        <VendorMachinesContent />
      </Suspense>
    </main>
  );
}

function MachinesLoading() {
  return (
    <Card>
      <CardContent className="p-6 text-sm text-muted-foreground">
        Loading your machines…
      </CardContent>
    </Card>
  );
}

async function VendorMachinesContent() {
  await connection();

  let machines: Awaited<ReturnType<typeof getMyMachines>> | null = null;
  let needsOnboarding = false;
  try {
    machines = await getMyMachines();
  } catch (error) {
    if (error instanceof MachineServiceError && error.code === "VENDOR_REQUIRED") {
      needsOnboarding = true;
    } else {
      throw error;
    }
  }

  if (needsOnboarding) {
    redirect("/vendor/onboarding");
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 border-b border-border/80 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Vendor operations
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Machines</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Register the vending machines your business owns or operates.
          </p>
        </div>
        <Button nativeButton={false} variant="outline" className="w-full sm:w-auto" render={<Link href="/vendor/dashboard" />}>
          Dashboard overview
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Add a machine</CardTitle>
            <CardDescription>Enter an identifying code and a name. Location is optional.</CardDescription>
          </CardHeader>
          <CardContent>
            <MachineForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your machines</CardTitle>
            <CardDescription>
              {machines?.length ?? 0} {machines?.length === 1 ? "machine" : "machines"} registered to your vendor account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!machines?.length ? (
              <div className="rounded-lg border border-dashed px-5 py-10 text-center">
                <Monitor aria-hidden="true" className="mx-auto mb-3 size-5 text-muted-foreground" />
                <p className="text-sm font-medium">No machines yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add the machines your business owns or operates. They will appear here after you register them.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border/80">
                {machines.map((machine) => (
                  <li key={machine.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href={`/vendor/machines/${machine.id}`}
                      className="-mx-2 flex min-w-0 flex-1 flex-col gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{machine.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {machine.machineCode}{machine.location ? ` · ${machine.location}` : ""}
                        </p>
                      </div>
                      <MachineStatus status={machine.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
