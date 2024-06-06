import React from 'react';
import CartModalList from './cart_model_list';
import Link from 'next/link';

import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectTotalGrandPrice,
} from '@/redux/cart/cartSelector';

interface CartModalProps {
  setShowCartPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

function CartModal({ setShowCartPanel }: CartModalProps) {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const grandTotal = useSelector(selectTotalGrandPrice);

  const handleCheckoutClick = () => {
    // Handle any checkout logic here
    // ...

    // Close the cart panel
    setShowCartPanel(false);
  };

  return (
    <div className="flex flex-col">
      {cartItems.map((cartItem, index) => (
        <CartModalList key={index} cartItem={cartItem} />
      ))}

      <hr className="mt-4 ml-4 mr-4" />
      <div className="flex flex-row justify-between mt-2 ml-4 mr-4">
        <span className="text-md">Subtotal</span>
        <span className="text-xl font-semibold">${grandTotal}</span>
      </div>
      <hr className="m-2" />
      <div className="flex flex-col items-center gap-2 mt-2">
        <Link href={'/cart'} onClick={handleCheckoutClick}>
          <span className="text-xl underline underline-offset-1 cursor-pointer hover:text-goldColor">
            View Cart
          </span>
        </Link>
        <Link
          href={'/checkout'}
          className="bg-primaryColor px-4 py-2 text-white hover:bg-goldColor"
          onClick={handleCheckoutClick}
        >
          <span>Checkout</span>
        </Link>
      </div>
    </div>
  );
}

export default CartModal;
