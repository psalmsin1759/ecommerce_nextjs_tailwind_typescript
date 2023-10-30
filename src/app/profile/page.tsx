'use client';
import React from 'react';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import Footer from '@/components/common/footer';

import Login from '@/components/login/login';
import MyProfile from '@/components/myprofile/myprofile';

export default function ProfilePage() {
  return (
    <div className="w-screen mt-4 flex flex-col">
      <div className="w-full bg-gray-100  p-5 items-center ">
        {/*  <span className="text-white">Home \ {categoryName}</span> */}
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="#" icon={HiHome}>
            <p>Home</p>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">Profile</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {/* <Login /> */}
      <MyProfile />
      <Footer />
    </div>
  );
}
