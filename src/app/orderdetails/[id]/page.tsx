'use client';

import React, { useState, useEffect } from 'react';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import Footer from '@/components/common/footer';
import { Progress } from 'flowbite-react';
import {
  getOrderByID,
  getOrderItems,
  OrderProduct,
} from '@/model/orderdetails';
import { Order } from '@/model/order';
import OrderItemList from '@/components/order/order_item_list';

function OrderDetails({ params }: { params: { id: number } }) {
  const [statusNumber, setStatusNumber] = useState(25);

  const [order, setOrder] = useState<Order>();
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);

  useEffect(() => {
    fetchOrder();
    fetchOrderItem();
  }, []);

  const fetchOrder = async () => {
    try {
      const orderData = await getOrderByID(params.id);

      setOrder(orderData);

      if (orderData.status === 'Processing') {
        setStatusNumber(25);
      } else if (orderData.status === 'Processed') {
        setStatusNumber(50);
      } else if (orderData.status === 'Shipped') {
        setStatusNumber(75);
      } else if (orderData.status === 'Success') {
        setStatusNumber(100);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchOrderItem = async () => {
    try {
      const data = await getOrderItems(params.id);
      setOrderProducts(data);
    } catch (error) {
      console.error('Failed to fetch order items:', error);
    }
  };

  return (
    <div className="mt-4 w-screen min-h-60">
      <div className=" bg-gray-100 w-screen items-center p-4">
        <Breadcrumb aria-label="Default breadcrumb  example">
          <Breadcrumb.Item href="#" icon={HiHome}>
            <p>Home</p>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Order</Breadcrumb.Item>
          <Breadcrumb.Item>#{params.id}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="w-screen flex flex-col p-8">
        <span className="text-2xl"> Order Details #{params.id}</span>
        <span className="text-lg mt-4"> Track your order</span>
        <Progress className="mt-2" progress={statusNumber} />
        <div className="w-full flex flex-row mt-2">
          <div className="basis-1/4 text-right">Processing</div>
          <div className="basis-1/4 text-right">Processed</div>
          <div className="basis-1/4 text-right">Shipped</div>
          <div className="basis-1/4 text-right">Completed</div>
        </div>

        <div className="w-full bg-gray-100 p-4 mt-8 flex flex-col md:flex-row gap-4">
          <div className="w-full flex-col p-8 bg-white">
            <span className="text-lg font-semibold">Shipping Information</span>
            <div className="flex flex-row justify-between mt-2">
              <span>Name</span>
              <span>
                {order?.first_name} {order?.last_name}
              </span>
            </div>
            <div className="flex flex-row justify-between mt-2">
              <span>Email</span>
              <span>{order?.email}</span>
            </div>
            <div className="flex flex-row justify-between mt-2">
              <span>Phone</span>
              <span>{order?.phone}</span>
            </div>
            <div className="flex flex-row justify-between mt-2">
              <span>Address</span>
              <span>{order?.shipping_address}</span>
            </div>
            <div className="flex flex-row justify-between mt-2">
              <span>City</span>
              <span>{order?.shipping_city}</span>
            </div>
            <div className="flex flex-row justify-between mt-2">
              <span>Postal Code</span>
              <span>{order?.shipping_postalCode}</span>
            </div>
            <div className="flex flex-row justify-between mt-2">
              <span>State</span>
              <span>{order?.shipping_state}</span>
            </div>
            <div className="flex flex-row justify-between mt-2">
              <span>Country</span>
              <span>{order?.shipping_country}</span>
            </div>
          </div>
          <div className="w-full flex-col p-8 bg-white gap-2">
            <span className="text-lg font-semibold ">Items</span>
            <div className="mt-2">
              {orderProducts?.map((orderProduct: OrderProduct) => (
                <OrderItemList orderProduct={orderProduct} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OrderDetails;
