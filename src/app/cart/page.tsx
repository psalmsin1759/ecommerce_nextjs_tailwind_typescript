'use client';
import React from 'react';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
//import CartList from '@/components/product/cart/cart_list';
import CartList2 from '@/components/cart/cart_list2';
import Link from 'next/link';

import { clearCart } from '@/redux/cart/cartSlice';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectTotalGrandPrice,
  selectIsCartEmpty,
} from '@/redux/cart/cartSelector';

function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const grandTotal = useSelector(selectTotalGrandPrice);

  const isCartEmpty = useSelector(selectIsCartEmpty);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="flex flex-col min-h">
      <div className=" bg-gray-100 w-full p-5 items-center ">
        {/*  <span className="text-white">Home \ {categoryName}</span> */}
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/home" icon={HiHome}>
            <p>Home</p>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">Cart</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="p-3 flex flex-col">
        <div className="m-6">
          <span className="text-5xl font-semibold">Shopping Cart</span>
        </div>
        <div className="flex w-full flex-col md:flex-row ml-2 mr-2">
          <div className="basis-2/3 p-2">
            <div className="pt-4 grid grid-cols-1 md:grid-cols-5">
              <div className=" col-span-2 flex justify-start">
                <span className="font-semibold text-sm">Product</span>
              </div>
              <div className="hidden md:block text-center">
                <span className="font-semibold text-sm ">Price</span>
              </div>
              <div className="hidden md:block text-center">
                <span className="font-semibold text-sm">Quantity</span>
              </div>
              <div className="hidden md:block text-center">
                <span className="font-semibold text-sm">Subtotal</span>
              </div>
            </div>
            {cartItems.map((cartItem, key) => (
              <CartList2 key={key} cartItem={cartItem} />
            ))}

            <hr className="mt-4" />
            <div className="w-full text-right mt-4 mb-12 pr-4">
              <span
                onClick={handleClearCart}
                className="text-xl underline underline-offset-1 cursor-pointer hover:text-red-500"
              >
                Clear All
              </span>
            </div>
          </div>

          <div className="basis-1/3 p-8 bg-gray-100 mr-4 flex flex-col h-96 mb-12">
            <span className="text-3xl font-semibold">Cart totals</span>
            <div className="flex flex-row justify-between mt-12 mb-4">
              <span>Subtotal</span>
              <span>${grandTotal}</span>
            </div>
            <hr className="text-black" />
            <div className="flex flex-row justify-between mt-6 mb-4">
              <span>Shipping</span>
              <span>Shipping calculated at checkout</span>
            </div>
            <hr />
            <div className="flex flex-row justify-between mt-6 mb-4">
              <span>Total</span>
              <span className="text-2xl font-semibold">${grandTotal}</span>
            </div>
            <Link href={'/checkout'}>
              <div className="w-full rounded-full bg-black hover:bg-goldColor p-2 text-center mt-6">
                <span className="text-xl text-white">Proceed to checkout</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
