import React from 'react';
import { Order } from '@/model/order';

interface OrderItemProps {
  order: Order;
}

function OrderListItem({ order }: OrderItemProps) {
  return (
    <div className="flex border-2 mt-2">
      <div className="flex flex-grow p-4 justify-center border-x-2">
        #{order.orderid}
      </div>
      <div className="flex flex-grow  p-4 justify-center border-x-2">
        {order.created_at}
      </div>
      <div className="flex flex-grow  p-4 justify-center border-x-2">
        {order.status}
      </div>
      <div className="flex flex-grow  p-4 justify-center border-x-2">
        {order.total_price}
      </div>
    </div>
  );
}

export default OrderListItem;
