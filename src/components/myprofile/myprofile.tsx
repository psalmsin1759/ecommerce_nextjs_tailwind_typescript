import React, { useState } from 'react';
import Image from 'next/image';
import { FaUser, FaHeart, FaThList, FaKey, FaSignOutAlt } from 'react-icons/fa';
import { ProfileMenu } from '@/model/profilemenu';
import MenuComponent from './menu_component';
import UpdateProfile from './update_profile';
import WishListPage from './wishlist_page';
import OrderListPage from './orderlist_page';
import ChangePassword from './change_password';

export default function MyProfile() {
  const profileMenus: ProfileMenu[] = [
    { text: 'My Profile', icon: <FaUser /> },
    { text: 'Order List', icon: <FaThList /> },
    { text: 'Wishlist', icon: <FaHeart /> },
    { text: 'Change Password', icon: <FaKey /> },
    { text: 'Logout', icon: <FaSignOutAlt /> },
  ];

  const [selectedMenuItem, setSelectedMenuItem] =
    useState<string>('My Profile');

  const renderSelectedComponent = () => {
    switch (selectedMenuItem) {
      case 'My Profile':
        return <UpdateProfile />;
      case 'Wishlist':
        return <WishListPage />;
      case 'Order List':
        return <OrderListPage />;
      case 'Change Password':
        return <ChangePassword />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row m-8 gap-4 ">
      <div className="w-full flex flex-col justify-center items-center p-8 border shadow md:basis-1/4 ">
        <Image src={'/images/user1.png'} alt="" width={100} height={100} />

        <span className="text-xl mt-4">Your Name</span>
        <span className="text-sm">Your Email</span>

        {profileMenus.map((item, index) => (
          <MenuComponent
            key={index}
            profileMenu={item}
            onClick={() => setSelectedMenuItem(item.text)}
          />
        ))}
      </div>
      <div className="w-full flex flex-col  p-8 border shadow md:basis-3/4">
        {renderSelectedComponent()}
      </div>
    </div>
  );
}
