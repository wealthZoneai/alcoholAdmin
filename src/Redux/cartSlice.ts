import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  cartItemId: number;
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  discount: number;
  unitType: string | null;
  minValue: number | null;
  maxValue: number | null;
}


interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    // ✅ Replace entire cart from backend
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    // ✅ Add single item (local add-to-cart)
    // ✅ Add / merge
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const payload = action.payload;

      const existing = state.items.find(
        (i) => i.cartItemId === payload.cartItemId
      );

      if (existing) {
        existing.quantity += payload.quantity;
      } else {
        state.items.push(payload);
      }
    },




    // ❌ Remove one item
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (i) => i.cartItemId !== action.payload
      );
    },


    // ❌ Empty cart
    clearCart: (state) => {
      state.items = [];
    },

    // ❌ Update quantity to new value
    updateQuantity: (
      state,
      action: PayloadAction<{ cartItemId: number; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) => i.cartItemId === action.payload.cartItemId
      );
      if (item) item.quantity = action.payload.quantity;
    },


    // ➕ Increase quantity (dynamic step)
    increaseQuantity: (
      state,
      action: PayloadAction<{ cartItemId: number; amount: number }>
    ) => {
      const { cartItemId, amount } = action.payload;
      const item = state.items.find(
        (i) => i.cartItemId === cartItemId
      );

      if (item) item.quantity += amount;
    },


    decreaseQuantity: (
      state,
      action: PayloadAction<{ cartItemId: number; amount: number; min: number }>
    ) => {
      const { cartItemId, amount, min } = action.payload;
      const item = state.items.find(
        (i) => i.cartItemId === cartItemId
      );

      if (!item) return;

      const newQty = item.quantity - amount;

      if (newQty < min) {
        state.items = state.items.filter(
          (i) => i.cartItemId !== cartItemId
        );
      } else {
        item.quantity = newQty;
      }
    },



  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
