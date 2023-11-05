import React from 'react';
import { Product } from '@/model/Product';
import { removeFromCart } from '@/redux/cart/cartSlice';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import imageBasePath from '@/components/common/path';

interface ProductCardProps {
  product: Product;
}

function CartCheckoutList({ product }: ProductCardProps) {
  const dispatch = useDispatch();

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(product));
  };

  return (
    <div className="flex flex-col ">
      <div className="flex flex-row">
        <div className="bg-white p-2">
          <Image
            src={imageBasePath + 'product/' + product.images[0]?.path}
            alt={product.name}
            width={90}
            height={116}
          />
        </div>
        <div className="m-4">
          <span className="text-gray-500 font-semibold">{product.name}</span>
          <div className="flex flex-row gap-2">
            <span>{product.quantity}</span>
            <span>X</span>
            <span>{product.price}</span>
          </div>
        </div>
      </div>
      <div className="m-2 w-full ">
        <hr className=" h-px bg-gray-300" />
      </div>
    </div>
  );
}

export default CartCheckoutList;
