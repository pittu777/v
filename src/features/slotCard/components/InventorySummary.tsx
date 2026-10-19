
import { useInventory } from "@/src/stores/inventory-store";
import { Slot } from "./SlotCard";
import { inStock, isLowStock, IsOutOfStock } from "@/lib/formatters";

interface InventorySummaryProps {
  slots: Slot[];
}

const InventorySummary = ({ slots }: InventorySummaryProps) => {
  
  const totalSlots = slots.length;

  const setFilter = useInventory(
    (state) => state.setSelectedFilter
  )

  const slectedFilter = useInventory(
    (state) => state.selectedFilter
  )

  console.log("selectedFilter", slectedFilter);

  
  const hasProduct = (slot: Slot) =>
    Boolean(slot.productName?.trim());

  
  const emptySlotCount = slots.filter(
    (slot) => !hasProduct(slot)
  ).length;

  
  const lowStockCount = slots.filter(
    (slot) =>
      hasProduct(slot) &&
      slot.stock.current > 0 &&
      isLowStock(slot.stock.current)
  ).length;

  
  const inStockCount = slots.filter(
    (slot) =>
      hasProduct(slot) &&
      !isLowStock(slot.stock.current) &&
      !IsOutOfStock(slot.stock.current)
  ).length;

  
  const outOfStockCount = slots.filter(
    (slot) =>
      hasProduct(slot) &&
      IsOutOfStock(slot.stock.current)
  ).length;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">
        Inventory Summary
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
     >
        <div className="rounded-xl border p-4"  onClick={()=> setFilter("ALL")}>
          <p className="text-sm text-zinc-500">Total Slots</p>
          <p className="mt-1 text-2xl font-bold">{totalSlots}</p>
        </div>

        <div className="rounded-xl border p-4"  onClick={()=> setFilter("IN_STOCK")}>
          <p className="text-sm text-emerald-600">In Stock</p>
          <p className="mt-1 text-2xl font-bold">{inStockCount}</p>
        </div>

        <div className="rounded-xl border p-4"  onClick={()=> setFilter("LOW_STOCK")}>
          <p className="text-sm text-amber-600">Low Stock</p>
          <p className="mt-1 text-2xl font-bold">{lowStockCount}</p>
        </div>

        <div className="rounded-xl border p-4"  onClick={()=> setFilter("OUT_OF_STOCK")}>
          <p className="text-sm text-red-600">Out of Stock</p>
          <p className="mt-1 text-2xl font-bold">{outOfStockCount}</p>
        </div>

        <div className="rounded-xl border p-4"  onClick={()=> setFilter("EMPTY")}>
          <p className="text-sm text-zinc-500">Empty Slots</p>
          <p className="mt-1 text-2xl font-bold">{emptySlotCount}</p>
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;
