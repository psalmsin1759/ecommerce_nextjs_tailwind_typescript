import React from 'react';
import { ProfileMenu } from '@/model/profilemenu';

interface MenuItemProps {
  profileMenu: ProfileMenu;
  onClick: () => void;
}

function MenuComponent({ profileMenu, onClick }: MenuItemProps) {
  return (
    <div
      className="w-full flex flex-row gap-2 p-2 mt-4 items-center cursor-pointer"
      onClick={onClick}
    >
      <div className="rounded shadow p-2"> {profileMenu.icon}</div>{' '}
      {profileMenu.text}
    </div>
  );
}

export default MenuComponent;
