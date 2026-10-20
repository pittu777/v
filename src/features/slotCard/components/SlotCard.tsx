import { formatINR, isLowStock } from "../../../../lib/formatters";


interface StockLevel{
    current: number;
    capacity: number;
}





export interface Slot{
    slotCode : string;
    productName? : string;
    price:number;
    stock : StockLevel;
    onSelect?: ()=>void; 
    isSelected?: boolean;
}




export const SlotCard=({
    price,
    slotCode,
    stock,
    onSelect,
    productName,
}:Slot)=>{


    const isOutOfStock = stock.current ===0;
    const hasLowStock = isLowStock(stock.current);

    const badgeStyles = isOutOfStock ? "bg-red-50 text-red-700 border-red-200" : hasLowStock ? 
     "bg-amber-50 text-amber-700 border-amber-200"
  : "bg-emerald-50 text-emerald-700 border-emerald-200";


  const badgeText = isOutOfStock
  ? "Out of Stock"
  : hasLowStock
  ? "Low Stock"
  : "In Stock";

    return (
  <div
    onClick={onSelect}
    className="flex flex-col justify-between p-4 rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md hover:border-zinc-300 transition-all cursor-pointer min-h-[160px]"
  >
    {/* 1. Header: Slot Code & Status Badge */}
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold tracking-wider px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-md uppercase">
        Slot {slotCode}
      </span>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${badgeStyles}`}>
        {badgeText}
      </span>
    </div>

    {/* 2. Middle: Product Name & Price */}
    <div className="my-3">
      <h3 className="font-semibold text-zinc-900 text-base leading-snug">
        {productName || <span className="text-zinc-400 italic">Empty Slot</span>}
      </h3>
      <p className="text-sm font-medium text-zinc-600 mt-1">
        {formatINR(price)}
      </p>
    </div>

    {/* 3. Footer: Stock Counts */}
    <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
      <span>Available</span>
      <span className="font-semibold text-zinc-700">
        {stock.current} / {stock.capacity}
      </span>
    </div>
  </div>
);


}