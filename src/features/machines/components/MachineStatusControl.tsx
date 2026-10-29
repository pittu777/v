"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type MachineStatusControlProps = {
  machineId: string;
  status: string;
};

export function MachineStatusControl({ machineId, status }: MachineStatusControlProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextStatus = status === "ACTIVE"
    ? "INACTIVE"
    : status === "INACTIVE"
      ? "ACTIVE"
      : null;

  async function updateStatus() {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/vendors/me/machines/${machineId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        setError(result.message ?? "Could not update the machine status.");
        return;
      }

      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      {nextStatus ? (
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={isSaving}
          onClick={updateStatus}
        >
          {isSaving
            ? "Updating status…"
            : nextStatus === "INACTIVE"
              ? "Set machine inactive"
              : "Set machine active"}
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          This status can be viewed here but cannot be changed from this screen.
        </p>
      )}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
