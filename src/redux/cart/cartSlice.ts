import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/model/Product';

interface CartState {
  items: Product[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity: number;
        option: string;
      }>
    ) => {
      const { product, quantity, option } = action.payload;
      const existingProduct = state.items.find(
        (item) => item.id === action.payload.product.id
      );

      if (existingProduct) {
        // If the product is already in the cart, increment its quantity
        existingProduct.quantity += quantity;
      } else {
        // If it's a new product, add it to the cart with a quantity of 1
        state.items.push({
          ...action.payload.product,
          quantity: quantity,
          option: option,
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<Product>) => {
      const existingProduct = state.items.find(
        (item) => item.id === action.payload.id
      );
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    increaseQuantity: (state, action: PayloadAction<Product>) => {
      const product = state.items.find((item) => item.id === action.payload.id);
      if (product) {
        product.quantity += 1;
      }
    },
    decreaseQuantity: (state, action: PayloadAction<Product>) => {
      const product = state.items.find((item) => item.id === action.payload.id);
      if (product && product.quantity > 1) {
        product.quantity -= 1;
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
