'use client';
import React from 'react';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import Footer from '@/components/common/footer';
import { MdOutlineMarkEmailRead } from 'react-icons/md';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

function StatusPage() {
  const searchParams = useSearchParams();

  const orderID = searchParams.get('orderid');
  const total = searchParams.get('total');
  const purchasedate = searchParams.get('purchasedate');

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
          <MdOutlineMarkEmailRead size="25" />
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
              <span>#{orderID}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Order Date:</span>
              <span>{purchasedate}</span>
            </div>
            <div className=" flex justify-between mb-2">
              <span>Total Amount:</span>
              <span>${total}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-1">
          <span>You can check the </span>
          <Link href="/profile" className="text-goldColor">
            My Account
          </Link>
          <span>page at any time to check the status of your order.</span>
        </div>
        <Link
          href="/"
          className="bg-primaryColor mt-4 text-white px-4 py-2 rounded-lg mb-8 hover:bg-goldColor"
        >
          Continue Shopping
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default StatusPage;
