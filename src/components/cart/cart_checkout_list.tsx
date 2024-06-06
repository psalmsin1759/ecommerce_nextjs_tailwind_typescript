import React from 'react';
import { Product } from '@/model/Product';
import { CartItem, removeFromCart } from '@/redux/cart/cartSlice';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import imageBasePath from '@/components/common/path';

interface ProductCardProps {
  cartItem: CartItem;
}

function CartCheckoutList({ cartItem }: ProductCardProps) {
  const dispatch = useDispatch();

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(cartItem.product));
  };

  return (
    <div className="flex flex-col ">
      <div className="flex flex-row">
        <div className="bg-white p-2">
          <Image
            src={imageBasePath + 'product/' + cartItem.product.images[0]?.path}
            alt={cartItem.product.name}
            width={90}
            height={116}
          />
        </div>
        <div className="m-4">
          <span className="text-gray-500 font-semibold">
            {cartItem.product.name}
          </span>
          <div className="flex flex-row gap-2">
            <span>{cartItem.quantity}</span>
            <span>X</span>
            <span>{cartItem.product.price}</span>
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
