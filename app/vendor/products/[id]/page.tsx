import { Suspense } from "react";
import { connection } from "next/server";
import { ProductForm } from "@/features/products/components/ProductForm";
import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/features/users/services/user.service";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ProductLoading />}>
      <EditProductContent params={params} />
    </Suspense>
  );
}

function ProductLoading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading product…</CardContent></Card>
    </main>
  );
}

async function EditProductContent({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  let vendor: Awaited<ReturnType<typeof requireVendor>>;
  try {
    vendor = await requireVendor();
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") redirect("/sign-in");
    if (error instanceof Error && error.message === "FORBIDDEN") redirect("/vendor/onboarding");
    throw error;
  }

  const product = await prisma.product.findFirst({ where: { id, vendorId: vendor.id } });
  if (!product) notFound();
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Products</p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Edit product</h1>
        </header>
        <ProductForm product={{
          id: product.id,
          sku: product.sku,
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          stock: product.stock,
          isActive: product.isActive,
        }} />
      </div>
    </main>
  );
}
