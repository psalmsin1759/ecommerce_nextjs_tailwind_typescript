'use client';
import React from 'react';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import Footer from '@/components/common/footer';

function RefundPage() {
  return (
    <div className="w-screen mt-4 flex flex-col">
      <div className="w-full bg-gray-100  p-5 items-center ">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="#" icon={HiHome}>
            <p>Home</p>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">Refund Policy</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className=" min-h-screen"></div>
      <Footer />
    </div>
  );
}

export default RefundPage;
