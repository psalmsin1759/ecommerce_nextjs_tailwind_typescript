import React, { useState } from 'react';
import Image from 'next/image';
import { FaUser, FaHeart, FaThList, FaKey, FaSignOutAlt } from 'react-icons/fa';
import { ProfileMenu } from '@/model/profilemenu';
import MenuComponent from './menu_component';
import UpdateProfile from './update_profile';
import WishListPage from './wishlist_page';
import OrderListPage from './orderlist_page';
import ChangePassword from './change_password';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function MyProfile() {
  const profileMenus: ProfileMenu[] = [
    { text: 'My Profile', icon: <FaUser /> },
    { text: 'Order List', icon: <FaThList /> },
    { text: 'Wishlist', icon: <FaHeart /> },
    { text: 'Change Password', icon: <FaKey /> },
    { text: 'Logout', icon: <FaSignOutAlt /> },
  ];

  const router = useRouter();
  const { dispatch } = useUser();

  const [selectedMenuItem, setSelectedMenuItem] =
    useState<string>('My Profile');

  const handleLogout = () => {
    window.localStorage.removeItem('userData');
    dispatch({ type: 'LOGOUT' });
    router.replace('/');
    window.location.reload();
  };

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
      case 'Logout':
        // Call the handleLogout function when "Logout" is selected
        handleLogout();
        return null;
      default:
        return null;
    }
  };

  const { state } = useUser();

  return (
    <div className="flex flex-col md:flex-row m-8 gap-4 ">
      <div className="w-full flex flex-col justify-center items-center p-8 border shadow md:basis-1/4 ">
        <Image src={'/images/user1.png'} alt="" width={100} height={100} />

        <span className="text-xl mt-4">
          {state.user?.firstName} {state.user?.lastName}
        </span>
        <span className="text-sm">{state.user?.email}</span>

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
