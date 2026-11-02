import { ProductForm } from "@/features/products/components/ProductForm";
import { requireVendor } from "@/features/users/services/user.service";
import { Card, CardContent } from "@/components/ui/card";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function CreateProductPage() {
  return (
    <Suspense fallback={<CreateProductLoading />}>
      <CreateProductContent />
    </Suspense>
  );
}

function CreateProductLoading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading product form…</CardContent></Card>
    </main>
  );
}

async function CreateProductContent() {
  await connection();
  try {
    await requireVendor();
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") redirect("/sign-in");
    if (error instanceof Error && error.message === "FORBIDDEN") redirect("/vendor/onboarding");
    throw error;
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Products</p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Add a product</h1>
          <p className="text-sm leading-6 text-muted-foreground">Add an item to your vendor catalog.</p>
        </header>
        <ProductForm />
      </div>
    </main>
  );
}
