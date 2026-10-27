import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMyMachine, MachineServiceError } from "@/features/machines/machine.service";
import { connection } from "next/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

type MachinePageProps = { params: Promise<{ machineId: string }> };

export default function VendorMachinePage({ params }: MachinePageProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<MachineLoading />}>
        <VendorMachineContent params={params} />
      </Suspense>
    </main>
  );
}

function MachineLoading() {
  return (
    <Card>
      <CardContent className="p-6 text-sm text-muted-foreground">
        Loading machine details…
      </CardContent>
    </Card>
  );
}

async function VendorMachineContent({ params }: MachinePageProps) {
  await connection();
  const { machineId } = await params;
  let machine: Awaited<ReturnType<typeof getMyMachine>> | null = null;
  let needsOnboarding = false;
  let missingMachine = false;

  try {
    machine = await getMyMachine(machineId);
  } catch (error) {
    if (error instanceof MachineServiceError && error.code === "VENDOR_REQUIRED") {
      needsOnboarding = true;
    } else if (error instanceof MachineServiceError && error.code === "NOT_FOUND") {
      missingMachine = true;
    } else {
      throw error;
    }
  }

  if (needsOnboarding) redirect("/vendor/onboarding");
  if (missingMachine || !machine) notFound();

  return (
    <div className="space-y-6">
      <Button nativeButton={false} variant="ghost" render={<Link href="/vendor/machines" />}>
        Back to machines
      </Button>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Machine details
            </p>
            <CardTitle className="text-2xl tracking-tight">{machine.name}</CardTitle>
            <CardDescription>{machine.machineCode}</CardDescription>
          </div>
          <Button nativeButton={false} variant="outline" render={<Link href={`/vendor/machines/${machine.id}/edit`} />}>
            Edit machine
          </Button>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-8 gap-y-5 border-t pt-5 sm:grid-cols-2">
            <Detail label="Machine code" value={machine.machineCode} />
            <Detail label="Status" value={machine.status.toLowerCase()} />
            <Detail label="Location" value={machine.location || "Not provided"} />
            <Detail label="Added" value={machine.createdAt.toLocaleDateString()} />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="break-words text-sm font-medium">{value}</dd>
    </div>
  );
}
