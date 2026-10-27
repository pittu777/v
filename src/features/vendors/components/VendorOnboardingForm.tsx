"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createVendorSchema, type CreateVendorInput } from "@/features/vendors/vendor.schema";

type CreateVendorResponse = {
  success?: boolean;
  code?: string;
  message?: string;
  errors?: Partial<Record<keyof CreateVendorInput, string[]>>;
};

const fields: {
  name: keyof CreateVendorInput;
  label: string;
  type: "text" | "email";
  autoComplete: string;
  placeholder: string;
  wide?: boolean;
}[] = [
  {
    name: "businessName",
    label: "Business name",
    type: "text",
    autoComplete: "organization",
    placeholder: "Northside Vending Co.",
    wide: true,
  },
  {
    name: "contactPerson",
    label: "Contact person",
    type: "text",
    autoComplete: "name",
    placeholder: "Your full name",
  },
  {
    name: "businessEmail",
    label: "Business email",
    type: "email",
    autoComplete: "email",
    placeholder: "you@company.com",
  },
];

export function VendorOnboardingForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateVendorInput>({
    resolver: zodResolver(createVendorSchema),
    defaultValues: {
      businessName: "",
      contactPerson: "",
      businessEmail: "",
    },
  });

  async function submitProfile(values: CreateVendorInput) {
    setServerError(null);

    try {
      const response = await fetch("/api/vendors/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as CreateVendorResponse;

      if (!response.ok || !result.success) {
        if (result.code === "ALREADY_EXISTS") {
          router.replace("/vendor/dashboard");
          router.refresh();
          return;
        }

        const fieldErrors = result.errors;
        if (fieldErrors) {
          for (const name of Object.keys(fieldErrors) as (keyof CreateVendorInput)[]) {
            const message = fieldErrors[name]?.[0];
            if (message) setError(name, { type: "server", message });
          }
        }

        setServerError(
          result.message ?? "We couldn’t save your profile. Please try again.",
        );
        return;
      }

      router.replace("/vendor/dashboard");
      router.refresh();
    } catch {
      setServerError("We couldn’t reach the server. Check your connection and try again.");
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(submitProfile)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const error = errors[field.name];
          const errorId = `${field.name}-error`;

          return (
            <div
              key={field.name}
              className={`space-y-2 ${field.wide ? "sm:col-span-2" : ""}`}
            >
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className="h-10"
                {...register(field.name)}
              />
              {error?.message && (
                <p id={errorId} className="text-sm text-destructive">
                  {error.message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {serverError && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-5 text-muted-foreground">
          Your profile is linked to your signed-in account and can only be managed by you.
        </p>
        <Button type="submit" className="h-10 w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Saving profile…" : "Create vendor profile"}
        </Button>
      </div>
    </form>
  );
}
