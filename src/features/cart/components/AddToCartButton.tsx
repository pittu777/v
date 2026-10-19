

"use client";

import { useCartStore } from "@/src/stores/cart-store";

type Props={
    productId: string;
    name : string;
    price:number;
}


export function AddToCartButton({
    productId,
    name,
    price,
}: Props){
    const addItem = useCartStore((state) => state.addItem);

    return(
        <button onClick={()=> addItem({productId, name, price})}>
            Add to cart 
        </button>
    )
}