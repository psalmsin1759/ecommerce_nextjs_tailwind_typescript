import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { Product } from '@/model/Product';
import { CartItem } from './cartSlice';

export const selectCart = (state: RootState) => state.cart;

// Select the cart items
export const selectCartItems = createSelector(
  [selectCart],
  (cart) => cart.items
);

export const addToCart = (
  product: Product,
  quantity: number,
  options: string
) => {
  return {
    type: 'cart/addToCart',
    payload: {
      product,
      quantity,
      options,
    },
  };
};

// Select the total count of products in the cart
export const selectTotalProductsInCart = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

// Select the total price for each product
export const selectTotalPriceForProduct = createSelector(
  [selectCartItems],
  (items: CartItem[]) =>
    items.map((item) => ({
      product: item,
      totalPrice: (item.product.price * item.quantity).toFixed(2), // Calculate total price for each product
    }))
);

// Create a selector to calculate subtotal for a specific product
export const selectSubtotalForProduct = createSelector(
  [selectCartItems],
  (cart) => (productId: number) => {
    const item = cart.find((item) => item.product.id === productId);
    if (item) {
      return item.product.price * item.quantity;
    }
    return 0; // Default to 0 if the product is not found
  }
);

// Create a selector to calculate the grand total of all products in the cart
export const selectTotalGrandPrice = createSelector(
  [selectCartItems],
  (items) =>
    items
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
      .toFixed(2)
);

// Create a selector to check if the cart is empty
export const selectIsCartEmpty = createSelector(
  [selectCartItems],
  (items) => items.length === 0
);
