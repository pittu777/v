import { Slot } from "../components/SlotCard";


export const slots: Slot[]=[
      {
    slotCode: "A1",
    productName: "Water Bottle",
    price: 2000, // ₹20.00
    stock: {
      current: 8,
      capacity: 10,
    },
 
  },
  {
    slotCode: "A2",
    productName: "Potato Chips",
    price: 3000, // ₹30.00
    stock: {
      current: 2,
      capacity: 15,
    },
   
  },
  {
    slotCode: "A3",
    productName: "Chocolate Bar",
    price: 4500, // ₹45.00
    stock: {
      current: 0,
      capacity: 12,
    },
   
  },
  {
    slotCode: "B1",
    productName: "", // Empty slot with no product name
    price: 0,
    stock: {
      current: 0,
      capacity: 10,
    },
    
  },
  {
    slotCode: "B2",
    productName: "Energy Drink",
    price: 6500, // ₹65.00 - Normal product with a different price
    stock: {
      current: 10,
      capacity: 10,
    },
    
  }
]