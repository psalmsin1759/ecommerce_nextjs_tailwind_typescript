import React, { useState, useEffect } from 'react';
import { getOrders, Order } from '@/model/order';
import { useUser } from '@/context/UserContext';
import OrderListItem from './order_list_item';
import { Table } from 'flowbite-react';
import { format } from 'date-fns';
import Link from 'next/link';

function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const { state } = useUser();
  const userData = window.localStorage.getItem('userData');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const user = JSON.parse(userData!);
      const orderData = await getOrders(user.id ?? 0);

      setOrders(orderData);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  function formatDate(dateString: string): string {
    const createdDate = new Date(dateString);
    return format(createdDate, 'dd, MMM, yyyy');
  }

  return (
    <div className="p-2 flex flex-col gap-2">
      <span className="text-xl font-semibold mb-4">Order List</span>

      <Table striped>
        <Table.Head>
          <Table.HeadCell>Order ID</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Total</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y border">
          {orders?.map((order: Order, index) => (
            <Table.Row
              key={index}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                <Link
                  href={'/orderdetails/' + order.orderid}
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  {order.orderid}
                </Link>
              </Table.Cell>
              <Table.Cell>{formatDate(order.created_at)}</Table.Cell>
              <Table.Cell>{order.status}</Table.Cell>
              <Table.Cell>{order.total_price}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default OrderListPage;
