import { ProductForm } from "@/features/products/components/ProductForm";

export default function CreateProductPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Products</p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Add a product</h1>
        </header>
        <ProductForm />
      </div>
    </main>
  );
}
