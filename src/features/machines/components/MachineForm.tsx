"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMachineSchema, type CreateMachineInput } from "@/features/machines/machine.schema";

type EditableMachine = {
  id: string;
  machineCode: string;
  name: string;
  location: string | null;
};

type MachineResponse = {
  success?: boolean;
  message?: string;
  errors?: Partial<Record<keyof CreateMachineInput, string[]>>;
};

export function MachineForm({ machine }: { machine?: EditableMachine }) {
  const router = useRouter();
  const isEditing = Boolean(machine);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createMachineSchema),
    defaultValues: {
      machineCode: machine?.machineCode ?? "",
      name: machine?.name ?? "",
      location: machine?.location ?? "",
    },
  });

  async function submit(values: CreateMachineInput) {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(
        machine ? `/api/vendors/me/machines/${machine.id}` : "/api/vendors/me/machines",
        {
          method: machine ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );
      const result = (await response.json()) as MachineResponse;

      if (!response.ok || !result.success) {
        for (const name of Object.keys(result.errors ?? {}) as (keyof CreateMachineInput)[]) {
          const message = result.errors?.[name]?.[0];
          if (message) setError(name, { type: "server", message });
        }
        setServerError(result.message ?? "We couldn’t save this machine. Please try again.");
        return;
      }

      if (machine) {
        router.replace(`/vendor/machines/${machine.id}`);
        router.refresh();
        return;
      }

      reset();
      setSuccessMessage("Machine added to your vendor account.");
      router.refresh();
    } catch {
      setServerError("We couldn’t reach the server. Check your connection and try again.");
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submit)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="machineCode">Machine code</Label>
          <Input
            id="machineCode"
            autoComplete="off"
            placeholder="VM-001"
            aria-invalid={Boolean(errors.machineCode)}
            aria-describedby={errors.machineCode ? "machineCode-error" : undefined}
            className="h-10"
            {...register("machineCode")}
          />
          {errors.machineCode?.message && (
            <p id="machineCode-error" className="text-sm text-destructive">{errors.machineCode.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Machine name</Label>
          <Input
            id="name"
            autoComplete="off"
            placeholder="Lobby machine"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="h-10"
            {...register("name")}
          />
          {errors.name?.message && (
            <p id="name-error" className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="location">Location <span className="font-normal text-muted-foreground">(optional)</span></Label>
          <Input
            id="location"
            autoComplete="street-address"
            placeholder="Building, floor, or site address"
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? "location-error" : undefined}
            className="h-10"
            {...register("location")}
          />
          {errors.location?.message && (
            <p id="location-error" className="text-sm text-destructive">{errors.location.message}</p>
          )}
        </div>
      </div>

      {serverError && <p role="alert" className="text-sm text-destructive">{serverError}</p>}
      {successMessage && <p role="status" className="text-sm text-muted-foreground">{successMessage}</p>}

      <Button type="submit" className="h-10 w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Saving machine…" : isEditing ? "Save changes" : "Add machine"}
      </Button>
    </form>
  );
}
