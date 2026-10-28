import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MachineForm } from "@/features/machines/components/MachineForm";
import { getMyMachine, MachineServiceError } from "@/features/machines/machine.service";
import { connection } from "next/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

type MachineEditPageProps = { params: Promise<{ machineId: string }> };

export default function EditVendorMachinePage({ params }: MachineEditPageProps) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Suspense fallback={<EditLoading />}>
        <EditVendorMachineContent params={params} />
      </Suspense>
    </main>
  );
}

function EditLoading() {
  return (
    <Card>
      <CardContent className="p-6 text-sm text-muted-foreground">
        Loading machine…
      </CardContent>
    </Card>
  );
}

async function EditVendorMachineContent({ params }: MachineEditPageProps) {
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
      <Button nativeButton={false} variant="ghost" render={<Link href={`/vendor/machines/${machine.id}`} />}>
        Cancel
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">Edit machine</CardTitle>
          <CardDescription>Update the identifying details and location for this machine.</CardDescription>
        </CardHeader>
        <CardContent>
          <MachineForm machine={machine} />
        </CardContent>
      </Card>
    </div>
  );
}
