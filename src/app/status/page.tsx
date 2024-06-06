'use client';
import React, { useEffect } from 'react';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import { MdOutlineMarkEmailRead } from 'react-icons/md';
import Link from 'next/link';
import Image from 'next/image';
import axios from '@/api/axios';
import qs from 'qs';

import { useSearchParams } from 'next/navigation';

function StatusPage() {
  const searchParams = useSearchParams();

  const transaction_ref = searchParams.get('payment_intent');
  const orderid = searchParams.get('orderid');
  const total = searchParams.get('total');
  const paymentGateway = searchParams.get('paymentgateway');

  const currentDate = new Date();
  const purchasedate = currentDate.toLocaleDateString('en-US');

  useEffect(() => {
    placeOrder();
  }, []);

  const placeOrder = async () => {
    const storedCartData = window.localStorage.getItem('cartData');

    const cartItems = JSON.parse(storedCartData!);

    console.log(cartItems);

    const storedOrderData = window.localStorage.getItem('orderData');

    if (storedOrderData) {
      const orderData = JSON.parse(storedOrderData);
      console.log(orderData);
      console.log(orderData.orderid);

      const input = {
        orderid: orderData.orderid,
        first_name: orderData.first_name,
        last_name: orderData.last_name,
        email: orderData.email,
        phone: orderData.phone,
        payment_method: orderData.payment_method,
        total_price: orderData.total_price,
        tax: 0,
        status: 'Processing',
        discount: orderData.discount,
        currency: 'NGR',
        shipping_price: orderData.shipping_price,
        shipping_address: orderData.shipping_address,
        shipping_postalcode: orderData.shipping_postalcode,
        shipping_city: orderData.shipping_city,
        shipping_state: orderData.shipping_state,
        shipping_country: orderData.shipping_country,
        cart_items: cartItems,
        create_account: orderData.create_account,
        password: orderData.password,
        payment_gateway: paymentGateway,
        transaction_ref: transaction_ref,
      };

      const URL = '/placeOrder';

      const response = await axios.post(URL, qs.stringify(input), {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      });

      console.log(response);

      if (response?.data.success) {
        window.localStorage.removeItem('orderData');
        window.localStorage.removeItem('cartData');
      } else {
        const message = response.data.message;
        alert(message);
      }
    }
  };

  return (
    <div className="w-screen mt-4 flex flex-col justify-center items-center">
      <div className="w-full bg-gray-100  p-5 items-center ">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="#" icon={HiHome}>
            <p>Home</p>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">Status</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="w-full mt-8 text-center  md:w-1/2 flex flex-col justify-center items-center p-8 gap-2">
        <div className="flex flex-row gap-2">
          <span className="text-5xl font-semibold">Thank You</span>
          <Image
            src={'/images/success.png'}
            height={50}
            width={50}
            alt="success"
          />
        </div>
        <span className="text-2xl ">Your order was completed successfully</span>
        <div className="flex flex-row gap-1">
          <MdOutlineMarkEmailRead size="28" />
          <span>
            An email receipt including the details of your order has been sent
            to the email address provided. Please keep it for your records.
          </span>
        </div>
        <div className="w-full flex flex-col mt-4">
          <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
          <div className="p-4 bg-gray-50 rounded-lg mt-4  ">
            <div className=" flex justify-between mb-2">
              <span>Order ID:</span>
              <span>#{orderid}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Order Date:</span>
              <span>{purchasedate}</span>
            </div>
            <div className=" flex justify-between mb-2">
              <span>Total Amount:</span>
              <span>${total}</span>
            </div>
            <div className="w-full flex flex-col md:flex-row items-start md:justify-between mb-2">
              <span>TransactionRef:</span>
              <span>{transaction_ref}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-1">
          <span>You can check your order status here </span>
          <Link
            href="/profile"
            className="text-primaryColor hover:underline hover:font-semibold"
          >
            My Account
          </Link>
        </div>

        <Link
          href="/"
          className="bg-primaryColor mt-4 text-white px-4 py-2 rounded-lg mb-8 hover:bg-goldColor"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default StatusPage;
