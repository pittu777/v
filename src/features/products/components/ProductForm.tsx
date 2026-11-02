"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  productSchema,
  updateProductSchema,
  type ProductFormInput,
  type ProductInput,
} from "@/features/products/product.schema";

type EditableProduct = {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  isActive: boolean;
};

type ProductResponse = {
  success?: boolean;
  message?: string;
  errors?: Partial<Record<keyof ProductInput, string[]>>;
};

const productFields = ["sku", "name", "description", "price", "stock", "isActive"] as const;

export function ProductForm({ product }: { product?: EditableProduct }) {
  const router = useRouter();
  const isEditing = Boolean(product);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: product?.sku ?? "",
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product ? Number(product.price) : undefined,
      stock: product?.stock ?? 0,
      isActive: product?.isActive ?? true,
    },
  });

  async function submit(values: ProductInput) {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(
        product ? `/api/products/${product.id}` : "/api/products",
        {
          method: product ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );
      const result = (await response.json()) as ProductResponse;

      if (!response.ok || !result.success) {
        for (const name of productFields) {
          const message = result.errors?.[name]?.[0];
          if (message) setError(name, { type: "server", message });
        }
        setServerError(result.message ?? "We couldn't save this product. Please try again.");
        return;
      }

      if (product) {
        router.replace(`/vendor/products/${product.id}`);
        router.refresh();
        return;
      }

      reset({ sku: "", name: "", description: "", price: undefined, stock: 0, isActive: true });
      setSuccessMessage("Product added to your catalog.");
      router.refresh();
    } catch {
      setServerError("We couldn't reach the server. Check your connection and try again.");
    }
  }

  async function handleDelete() {
    if (!product || isDeleting) return;
    if (!window.confirm("Delete this product? This action cannot be undone.")) return;

    setServerError(null);
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      const result = (await response.json()) as ProductResponse;
      if (!response.ok || !result.success) {
        setServerError(result.message ?? "Could not delete this product.");
        return;
      }
      router.replace("/vendor/products");
      router.refresh();
    } catch {
      setServerError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="sku">SKU</Label>
        <Input
          id="sku"
          autoComplete="off"
          placeholder="SKU-001"
          aria-invalid={Boolean(errors.sku)}
          aria-describedby={errors.sku ? "sku-error" : undefined}
          className="h-11"
          {...register("sku")}
        />
        {errors.sku?.message && <p id="sku-error" className="text-sm text-destructive">{errors.sku.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Product name</Label>
        <Input
          id="name"
          autoComplete="off"
          placeholder="Snack bar"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="h-11"
          {...register("name")}
        />
        {errors.name?.message && <p id="name-error" className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <textarea
          id="description"
          placeholder="Short description"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "description-error" : undefined}
          className="flex min-h-[88px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50 aria-invalid:border-destructive"
          {...register("description")}
        />
        {errors.description?.message && <p id="description-error" className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            min="0.01"
            max="99999999.99"
            step="0.01"
            placeholder="20.00"
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? "price-error" : undefined}
            className="h-11"
            {...register("price")}
          />
          {errors.price?.message && <p id="price-error" className="text-sm text-destructive">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            max="2147483647"
            step="1"
            placeholder="0"
            aria-invalid={Boolean(errors.stock)}
            aria-describedby={errors.stock ? "stock-error" : undefined}
            className="h-11"
            {...register("stock")}
          />
          {errors.stock?.message && <p id="stock-error" className="text-sm text-destructive">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border px-4 py-3">
        <input
          id="isActive"
          type="checkbox"
          className="mt-0.5 size-4 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-invalid={Boolean(errors.isActive)}
          aria-describedby={errors.isActive ? "isActive-error" : undefined}
          {...register("isActive")}
        />
        <div className="space-y-1">
          <Label htmlFor="isActive" className="cursor-pointer">Available in your catalog</Label>
          <p className="text-sm leading-5 text-muted-foreground">Inactive products remain saved but are marked unavailable.</p>
          {errors.isActive?.message && <p id="isActive-error" className="text-sm text-destructive">{errors.isActive.message}</p>}
        </div>
      </div>

      {serverError && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm leading-5 text-destructive">
          {serverError}
        </p>
      )}
      {successMessage && (
        <p role="status" className="rounded-lg border border-success/25 bg-success/5 px-3.5 py-3 text-sm leading-5 text-success">
          {successMessage}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="h-11" disabled={isSubmitting || isDeleting}>
          {isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Add product"}
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="destructive"
            className="h-11"
            disabled={isSubmitting || isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting…" : "Delete product"}
          </Button>
        )}
      </div>
    </form>
  );
}
