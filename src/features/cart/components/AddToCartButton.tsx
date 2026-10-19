

"use client";

import { useCartStore } from "@/src/stores/cart-store";

type Props={
    productId: string;
    name : string;
    price:number;
}


export function AddToCartButton({
    productId = "2",
    name = "cc",
    price = 333,
}: Props){
    const addItem = useCartStore((state) => state.addItem);

    const cartItems = useCartStore((state)=> state.items);
    console.log(cartItems);

    return(
        <button onClick={()=> addItem({productId, name, price})}>
            Add to cart 
        </button>
    )
}