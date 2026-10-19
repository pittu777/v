
"use client";
import { SlotCard } from './SlotCard'
import { slots } from '../exmple/slotData'
import InventorySummary from './InventorySummary';
import { filterSlots, type SlotFilter } from '../utils/slotFilters';
import { useInventory } from '@/src/stores/inventory-store';



const filters: { value: SlotFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "IN_STOCK", label: "In Stock" },
  { value: "LOW_STOCK", label: "Low Stock" },
  { value: "OUT_OF_STOCK", label: "Out of Stock" },
  { value: "EMPTY", label: "Empty" },
]


const SlotGrid = () => {
    

    const search = useInventory(
      (state) => state.searchQuery,
    )

    const selectedFilter = useInventory(
      (state) => state.selectedFilter,
    )
     const selectedSlot = useInventory(
      (state) => state.selectedSlot,
    )
    const setSelectedSlot = useInventory(
      (state) => state.selectSlot,
    )
    const setSelectedFilter = useInventory(
      (state) => state.setSelectedFilter,
    )
    const setSearch = useInventory(
      (state) => state.setSearchQuery,
    )

    const normalizedSearch = search.trim().toLowerCase();

    const filteredSlots = filterSlots(slots, selectedFilter).filter(
      (slot)=> {
        const slotCode = slot.slotCode.toLowerCase();
        const productName = slot.productName?.toLowerCase() ?? "";

        return (
      slotCode.includes(normalizedSearch) ||
      productName.includes(normalizedSearch)
    );
      }
    )

    const onSelect=(slotCode: string)=>{
      
        
        setSelectedSlot(slotCode)
        
    }

   return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Machine Inventory</h1>

      <InventorySummary slots={slots} />

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setSelectedFilter(filter.value)}
            aria-pressed={selectedFilter === filter.value}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
              selectedFilter === filter.value
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <form>
      <input
  type="text"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Search by product or slot code..."
  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-white"
/>
      </form>

      {filteredSlots.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No slots found for this filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSlots.map((slot) => (
            <SlotCard
              key={slot.slotCode}
              slotCode={slot.slotCode}
              productName={slot.productName}
              price={slot.price}
              stock={slot.stock}
              onSelect={() => setSelectedSlot(slot.slotCode)}
               isSelected={selectedSlot === slot.slotCode}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default SlotGrid