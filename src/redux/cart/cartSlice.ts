import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/model/Product';

export interface CartItem {
  product: Product;
  quantity: number;
  options: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { product, quantity, options } = action.payload;
      const existingProduct = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existingProduct) {
        // If the product is already in the cart, increment its quantity
        existingProduct.quantity += quantity;
      } else {
        // If it's a new product, add it to the cart with a quantity of 1
        state.items.push({
          product,
          quantity,
          options,
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<Product>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload.id
      );
    },
    increaseQuantity: (state, action: PayloadAction<Product>) => {
      const cartItem = state.items.find(
        (item) => item.product.id === action.payload.id
      );
      if (cartItem) {
        cartItem.quantity += 1;
      }
    },
    decreaseQuantity: (state, action: PayloadAction<Product>) => {
      const cartItem = state.items.find(
        (item) => item.product.id === action.payload.id
      );
      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
