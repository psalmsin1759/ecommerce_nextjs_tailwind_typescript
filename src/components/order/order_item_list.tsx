import React from 'react';
import Image from 'next/image';
import { OrderProduct } from '@/model/orderdetails';
import imageBasePath from '@/components/common/path';

interface OrderProductProps {
  orderProduct: OrderProduct;
}

function OrderItemList({ orderProduct }: OrderProductProps) {
  return (
    <div className="flex flex-col ">
      <div className="flex flex-row">
        <div className="bg-white p-2 border shadow">
          <Image
            src={imageBasePath + 'product/' + orderProduct.image_path}
            alt={orderProduct.name}
            width={90}
            height={116}
          />
        </div>
        <div className="m-4">
          <span className="text-gray-500 font-semibold">
            {orderProduct.name}
          </span>
          <div className="flex flex-row gap-2">
            <span>{orderProduct.qty}</span>
            <span>X</span>
            <span>{orderProduct.price}</span>
          </div>
        </div>
      </div>
      <div className="m-2 w-full ">
        <hr className=" h-px bg-gray-300" />
      </div>
    </div>
  );
}

export default OrderItemList;
