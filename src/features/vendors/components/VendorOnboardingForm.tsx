"use client";

import { useState, type FormEvent } from "react";

type CreateVendorResponse = {
  success: boolean;
  data?: { businessName: string };
  message?: string;
  errors?: { businessName?: string[] };
};

export function VendorOnboardingForm() {
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdName, setCreatedName] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/vendors/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName }),
      });
      const result = (await response.json()) as CreateVendorResponse;

      if (!response.ok || !result.success || !result.data) {
        setError(
          result.errors?.businessName?.[0] ??
            result.message ??
            "Could not create your vendor profile.",
        );
        return;
      }

      setCreatedName(result.data.businessName);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (createdName) {
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950"
      >
        <h2 className="text-lg font-semibold">Vendor profile created</h2>
        <p className="mt-2">{createdName} is now linked to your account.</p>
        <p className="mt-1 text-sm">
          Machine management will be added in the next feature.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="businessName" className="block text-sm font-medium">
          Business name
        </label>
        <input
          id="businessName"
          name="businessName"
          autoComplete="organization"
          required
          minLength={2}
          maxLength={120}
          value={businessName}
          onChange={(event) => setBusinessName(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating profile…" : "Create vendor profile"}
      </button>
    </form>
  );
}
