

interface StockLevel{
    current: number;
    capacity: number;
}


type Status = "In Stock" | "Low Stock" | "Out of Stock";



interface Slot{
    slotCode : string;
    productName? : string;
    price:number;
    stock : StockLevel;
    statusBadge :  Status;
    onSelect?: ()=>void; 
}