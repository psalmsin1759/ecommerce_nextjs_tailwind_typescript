import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/model/Product';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from '@/redux/cart/cartSlice';
import { selectSubtotalForProduct } from '@/redux/cart/cartSelector';
import { useSelector, useDispatch } from 'react-redux';

interface ProductCardProps {
  product: Product;
}

function CartList2({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const subtotalSelector = useSelector(selectSubtotalForProduct);

  const subtotal = subtotalSelector(product.id).toFixed(2);
  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(product));
  };

  const handleIncreaseQuantity = () => {
    dispatch(increaseQuantity(product));
  };

  const handleDecreaseQuantity = () => {
    dispatch(decreaseQuantity(product));
  };

  return (
    <div className="flex flex-col pt-4">
      <hr />
      <div className=" grid grid-cols-1 md:grid-cols-5">
        <div className="p-2 col-span-2">
          <div className="grid grid-cols-2 gap-0 ">
            <div
              onClick={handleRemoveFromCart}
              className="flex flex-row items-start cursor-pointer hover:text-primaryColor"
            >
              <svg
                className="w-6"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              <div className="w-20 h-28">
                <Image
                  className="w-20 h-28"
                  src={product.images[0]?.path}
                  alt="Logo"
                  width={80}
                  height={106}
                />
              </div>
            </div>
            <div className="flex flex-row gap-2 ">
              <div className="flex flex-col gap-1">
                <span className="text-base">{product.name}</span>
                <span className="text-sm text-gray-400">{product.option}</span>
                <div className="md:hidden">
                  <span className="text-red-500 mb-2 ">{product.price}</span>
                  <div className="rounded-full w-32 pl-4 pr-4 pt-2 pb-2 border-2 flex flex-row items-center justify-between gap-2">
                    <button type="button" onClick={handleIncreaseQuantity}>
                      <svg
                        className="w-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 6v12m6-6H6"
                        ></path>
                      </svg>
                    </button>
                    <span>{product.quantity}</span>
                    <button type="button" onClick={handleDecreaseQuantity}>
                      <svg
                        className="w-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M18 12H6"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:block p-6 text-center">
          {' '}
          <span className="text-red-500">${product.price}</span>
        </div>
        <div className="hidden md:block p-6 text-center ">
          <div className="rounded-full w-32 pl-4 pr-4 pt-2 pb-2 border-2 flex flex-row items-center justify-between gap-2">
            <button type="button" onClick={handleIncreaseQuantity}>
              <svg
                className="w-4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v12m6-6H6"
                ></path>
              </svg>
            </button>
            <span> {product.quantity}</span>
            <button type="button" onClick={handleDecreaseQuantity}>
              <svg
                className="w-4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M18 12H6"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="hidden md:block p-6 text-center">
          <span className="text-red-500">{subtotal}</span>
        </div>
      </div>
    </div>
  );
}

export default CartList2;
