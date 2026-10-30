import { Suspense } from "react";
import { connection } from "next/server";
import { ProductForm } from "@/features/products/components/ProductForm";
import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/features/users/services/user.service";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EditProductContent params={params} />
    </Suspense>
  );
}

async function EditProductContent({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const vendor = await requireVendor();
  const product = await prisma.product.findFirst({ where: { id, vendorId: vendor.id } });
  if (!product) return <p>Not found</p>;
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Products</p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Edit product</h1>
        </header>
        <ProductForm product={{ id: product.id, sku: product.sku, name: product.name, description: product.description, price: product.price.toString(), stock: product.stock }} />
      </div>
    </main>
  );
}
