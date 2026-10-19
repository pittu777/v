import {create} from "zustand";
import { type SlotFilter } from "../features/slotCard/utils/slotFilters";



type InventoryStore={
    searchQuery: string;
    selectedFilter: SlotFilter;
    selectedSlot: string | null;
    setSearchQuery:(query:string)=>void;
    setSelectedFilter:(filter: SlotFilter)=> void;
    selectSlot: (slotCode: string) => void;
    clearSelection:()=>void;
}


export const useInventory = create<InventoryStore>()((set)=>({
    searchQuery : "",
    selectedFilter : "ALL",
    selectedSlot: null,

    setSearchQuery:(query)=>
        set({searchQuery: query}),

    setSelectedFilter:(filter)=>
        set({selectedFilter: filter}),

    selectSlot:(slot)=>
        set({selectedSlot: slot}),
    clearSelection:()=>
        set({selectedSlot: null})
}))