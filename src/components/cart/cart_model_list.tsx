import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/model/Product';
import { removeFromCart } from '@/redux/cart/cartSlice';
import { useDispatch } from 'react-redux';

interface ProductCardProps {
  product: Product;
}

function CartModalList({ product }: ProductCardProps) {
  const dispatch = useDispatch();

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(product));
  };

  return (
    <div className="flex flex-row justify-between items-start mt-1 mr-4 ml-4">
      <div className="border p-2 overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <Image
            src={product.images[0]?.path}
            alt={product.name}
            width={80}
            height={106}
          />
        </Link>
      </div>
      <div className="m-4">
        <span className="text-gray-500 font-semibold">{product.name}</span>
        <div className="flex flex-row gap-2">
          <span>{product.quantity}</span>
          <span>X</span>
          <span>₦{product.price}</span>
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
