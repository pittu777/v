import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductServiceError } from "@/features/products/product.service";
import { getMyVendor, VendorServiceError } from "@/features/vendors/vendor.service";
import { listProducts } from "@/features/products/product.service";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Package, Plus } from "lucide-react";

export default function VendorProductsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Suspense fallback={<ProductsLoading />}>
        <VendorProductsContent />
      </Suspense>
    </main>
  );
}

function ProductsLoading() {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <span className="sr-only">Loading your products...</span>
      <div aria-hidden="true" className="h-24 animate-pulse rounded-xl bg-muted motion-reduce:animate-none" />
      <div aria-hidden="true" className="grid gap-4 sm:grid-cols-2">
        <div className="h-28 animate-pulse rounded-xl bg-muted motion-reduce:animate-none" />
        <div className="h-28 animate-pulse rounded-xl bg-muted motion-reduce:animate-none" />
      </div>
      <div aria-hidden="true" className="h-64 animate-pulse rounded-xl bg-muted motion-reduce:animate-none" />
    </div>
  );
}

async function VendorProductsContent() {
  // Clerk auth and profile data are request-specific. Do not evaluate them while prerendering.
  await connection();

  let vendor: Awaited<ReturnType<typeof getMyVendor>>;
  try {
    vendor = await getMyVendor();
  } catch (error) {
    if (error instanceof VendorServiceError && error.code === "UNAUTHORIZED") {
      redirect("/sign-in");
    }
    if (error instanceof VendorServiceError && error.code === "NOT_FOUND") {
      redirect("/vendor/onboarding");
    }
    throw error;
  }

  let products: Awaited<ReturnType<typeof listProducts>>;
  try {
    products = await listProducts();
  } catch (error) {
    if (error instanceof ProductServiceError && error.code === "UNAUTHORIZED") {
      redirect("/sign-in");
    }
    if (error instanceof ProductServiceError && error.code === "FORBIDDEN") {
      redirect("/vendor/onboarding");
    }
    throw error;
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      <header className="flex flex-col gap-5 border-b border-border/80 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Products
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            My Products
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Manage your product catalog for your vending business.
          </p>
        </div>
        <Button
          nativeButton={false}
          className="w-full sm:w-auto"
          render={<Link href="/vendor/products/create" />}
          >
            <Plus aria-hidden="true" />
            Add a product
          </Button>
      </header>

      <section aria-label="Product list" className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? "product" : "products"} in your catalog
        </p>
        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-muted/20 px-5 py-9 text-center">
            <Package aria-hidden="true" className="mx-auto mb-3 size-5 text-muted-foreground" />
            <p className="text-sm font-medium">No products registered</p>
            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
              Add your first product to start organizing your vending operations.
            </p>
            <Button
              nativeButton={false}
              variant="outline"
              className="mt-4"
              render={<Link href="/vendor/products/create" />}
              >
              Register a product
            </Button>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/vendor/products/${product.id}`}
                  className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Card className="h-full transition-shadow hover:shadow-sm">
                    <CardHeader className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="line-clamp-2 text-base">{product.name}</CardTitle>
                        <ProductAvailability isActive={product.isActive} />
                      </div>
                      <CardDescription className="truncate">SKU: {product.sku}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-end justify-between gap-3">
                      <span className="text-lg font-semibold tabular-nums">
                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(product.price))}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {product.stock} in stock
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ProductAvailability({ isActive }: { isActive: boolean }) {
  return (
    <span className={isActive
      ? "inline-flex shrink-0 items-center rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
      : "inline-flex shrink-0 items-center rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"}>
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
