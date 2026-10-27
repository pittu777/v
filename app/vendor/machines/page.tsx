import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateMachineForm } from "@/features/machines/components/CreateMachineForm";
import { getMyMachines, MachineServiceError } from "@/features/machines/machine.service";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function VendorMachinesPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
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
      <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Vendor operations
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Machines</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Register the vending machines your business owns or operates.
          </p>
        </div>
        <Button nativeButton={false} variant="outline" render={<Link href="/vendor/dashboard" />}>
          Back to dashboard
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Add a machine</CardTitle>
            <CardDescription>Enter an identifying code and a name. Location is optional.</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateMachineForm />
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
                <p className="text-sm font-medium">No machines yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add your first machine to start building your vendor inventory.
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {machines.map((machine) => (
                  <li key={machine.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{machine.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {machine.machineCode}{machine.location ? ` · ${machine.location}` : ""}
                      </p>
                    </div>
                    <span className="w-fit rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
                      {machine.status.toLowerCase()}
                    </span>
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
