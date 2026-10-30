"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Textarea component not available; using native textarea
import { productSchema, updateProductSchema, type ProductInput, type UpdateProductInput } from "@/features/products/product.schema";

type EditableProduct = {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
};

type ProductResponse = {
  success?: boolean;
  message?: string;
  errors?: Partial<Record<string, string[]>>;
};

export function ProductForm({ product }: { product?: EditableProduct }) {
  const router = useRouter();
  const isEditing = Boolean(product);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(isEditing ? updateProductSchema : productSchema),
    defaultValues: isEditing
      ? {
          name: product?.name ?? "",
          description: product?.description ?? "",
          price: product?.price ? Number(product.price) : undefined,
          stock: product?.stock ?? 0,
        }
      : {
          sku: "",
          name: "",
          description: "",
          price: undefined as unknown as number,
          stock: 0,
        },
  });

  async function submit(values: ProductInput | UpdateProductInput) {
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
        for (const name of Object.keys(result.errors ?? {})) {
          const message = result.errors?.[name]?.[0];
          if (message) setError(name as never, { type: "server", message });
        }
        setServerError(result.message ?? "We couldn't save this product. Please try again.");
        return;
      }
      if (product) {
        router.replace(`/vendor/products/${product.id}`);
        router.refresh();
        return;
      }
      reset();
      setSuccessMessage("Product added to your catalog.");
      router.refresh();
    } catch {
      setServerError("We couldn't reach the server. Check your connection and try again.");
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      const result = (await res.json()) as ProductResponse;
      if (!res.ok || !result.success) {
        setServerError(result.message ?? "Could not delete product.");
        return;
      }
      router.push("/vendor/products");
      router.refresh();
    } catch {
      setServerError("We couldn't reach the server.");
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submit)} noValidate>
      {!isEditing && (
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" autoComplete="off" placeholder="SKU-001" aria-invalid={Boolean(errors.sku)} className="h-11" {...register("sku")} />
          {errors.sku?.message as string && <p className="text-sm text-destructive">{errors.sku?.message as string}</p>}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">Product name</Label>
        <Input id="name" autoComplete="off" placeholder="Snack bar" aria-invalid={Boolean(errors.name)} className="h-11" {...register("name")} />
        {errors.name?.message as string && <p className="text-sm text-destructive">{errors.name?.message as string}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <textarea id="description" placeholder="Short description" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register("description")} />
        {errors.description?.message as string && <p className="text-sm text-destructive">{errors.description?.message as string}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="0.01" placeholder="1.50" aria-invalid={Boolean(errors.price)} className="h-11" {...register("price")} />
          {errors.price?.message as string && <p className="text-sm text-destructive">{errors.price?.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" step="1" placeholder="0" aria-invalid={Boolean(errors.stock)} className="h-11" {...register("stock")} />
          {errors.stock?.message as string && <p className="text-sm text-destructive">{errors.stock?.message as string}</p>}
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
      <div className="flex gap-3">
        <Button type="submit" className="h-11" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Add product"}
        </Button>
        {isEditing && (
          <Button type="button" variant="destructive" className="h-11" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
