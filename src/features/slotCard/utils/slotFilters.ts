


import type { Slot } from "../components/SlotCard";
import {
  inStock,
  isLowStock,
  IsOutOfStock,
} from "@/lib/formatters";

export type SlotFilter =
  | "ALL"
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "EMPTY";

const hasProduct = (slot: Slot): boolean =>
  Boolean(slot.productName?.trim());

const matchesFilter: Record<
  SlotFilter,
  (slot: Slot) => boolean
> = {
  ALL: () => true,

  EMPTY: (slot) => !hasProduct(slot),

  IN_STOCK: (slot) =>
    hasProduct(slot) && inStock(slot.stock.current),

  LOW_STOCK: (slot) =>
    hasProduct(slot) &&
    slot.stock.current > 0 &&
    isLowStock(slot.stock.current),

  OUT_OF_STOCK: (slot) =>
    hasProduct(slot) &&
    IsOutOfStock(slot.stock.current),
};

export function filterSlots(
  slots: Slot[],
  filter: SlotFilter
): Slot[] {
  return slots.filter(matchesFilter[filter]);
}
