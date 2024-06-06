import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/model/Product';
import { CartItem, removeFromCart } from '@/redux/cart/cartSlice';
import { useDispatch } from 'react-redux';
import imageBasePath from '@/components/common/path';

interface ProductCardProps {
  cartItem: CartItem;
}

function CartModalList({ cartItem }: ProductCardProps) {
  const dispatch = useDispatch();

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(cartItem.product));
  };

  return (
    <div className="flex flex-row justify-between items-start mt-1 mr-4 ml-4">
      <div className="border p-2 overflow-hidden">
        <Link href={`/product/${cartItem.product.id}`}>
          <Image
            src={imageBasePath + 'product/' + cartItem.product.images[0]?.path}
            alt={cartItem.product.name}
            width={80}
            height={106}
          />
        </Link>
      </div>
      <div className="m-4">
        <span className="text-gray-500 font-semibold block">
          {cartItem.product.name}
        </span>
        <span className="text-gray-400 text-sm">{cartItem.options}</span>
        <div className="flex flex-row gap-2">
          <span>{cartItem.quantity}</span>
          <span>X</span>
          <span>${cartItem.product.price}</span>
        </div>
      </div>
      <div
        onClick={handleRemoveFromCart}
        className=" cursor-pointer ml-2 rounded-full bg-gray-400 p-1 text-white  w-5 h-5 flex items-center justify-center"
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
      </div>
    </div>
  );
}

export default CartModalList;
