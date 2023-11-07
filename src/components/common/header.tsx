'use client';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from '@/api/axios';
import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import CartModal from '@/components/cart/cart_modal';
import { getAllCategories, Category } from '@/model/category';
import { AiOutlineMenu } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { FaSearch, FaUserAlt, FaShoppingCart } from 'react-icons/fa';
import { FaRegUser } from 'react-icons/fa6';
import { BsCart3 } from 'react-icons/bs';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { Dropdown } from 'flowbite-react';

import { useSelector, useDispatch } from 'react-redux';
import { selectTotalProductsInCart } from '@/redux/cart/cartSelector';

import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function HeaderNew() {
  //const dispatch = useDispatch();
  const totalCount = useSelector(selectTotalProductsInCart);

  const [showCartPanel, setShowCartPanel] = useState(false);

  const toggleCartPanel = () => {
    setShowCartPanel(!showCartPanel);
  };

  const panelRef = useRef<HTMLDivElement | null>(null); // Specify the type

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowCartPanel(false);
      }
    };

    if (showCartPanel) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showCartPanel]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const productsData = await getAllCategories();

      const mainCategories = productsData.filter(
        (category) => category.parent_id === 0
      );
      setCategories(mainCategories);
      setSubcategories(
        productsData.filter((category) => category.parent_id !== 0)
      );
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };
  const router = useRouter();

  const { state } = useUser();

  const { dispatch } = useUser();

  const handleLogout = () => {
    // const { dispatch } = useUser();
    console.log('logout');
    dispatch({ type: 'LOGOUT' });
    router.replace('/login');
  };

  return (
    <>
      <Disclosure
        as="nav"
        className="shadow pt-2 pb-2 items-center  text-hw"
        style={{ opacity: showCartPanel ? 0.7 : 1 }}
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-primaryColor hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <AiOutlineMenu
                        className="block h-6 w-6 text-black"
                        aria-hidden="true"
                      />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link href={'/'}>
                      <Image
                        className=" w-64"
                        src="https://bakersluxury.com/wp-content/uploads/2019/11/header-logo.png"
                        alt="Logo"
                        width={222}
                        height={60}
                      />
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex mt-4 mx-auto space-x-4">
                      {categories?.map((category: Category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.id}`}
                          className="text-black-900 hover:font-semibold rounded-md px-3 py-2 text-md font-medium"
                          aria-current="page"
                        >
                          {category.name}
                        </Link>
                      ))}
                      {/* {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? ' text-black-300'
                            : 'text-black-900  hover:font-semibold',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))} */}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="hidden md:block">
                    <BiSearch size="30" />
                  </div>

                  <Dropdown
                    dismissOnClick={false}
                    renderTrigger={() => (
                      <span>
                        <FaRegUser className=" cursor-pointer" size="26" />
                      </span>
                    )}
                    label={'undefined'}
                  >
                    {state.user ? ( // Check if the user is logged in
                      <>
                        <Dropdown.Item>
                          <Link href="/profile">My Account</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <Link href="/profile">Orders</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <Link href="/profile">Wishlist</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <button type="button" onClick={handleLogout}>
                            Logout
                          </button>
                        </Dropdown.Item>
                      </>
                    ) : (
                      <>
                        <Dropdown.Item>
                          <Link href="/login">Register</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <Link href="/login">Login</Link>
                        </Dropdown.Item>
                      </>
                    )}
                  </Dropdown>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCartPanel(!showCartPanel)}
                      className="hover:text-gray-200"
                    >
                      <BsCart3 size="26" className=" mr-4" />
                    </button>
                    <div className="absolute top-0 right-0 -mt-3   rounded-full bg-red-500 p-1 text-white  w-6 h-6 flex items-center justify-center">
                      <span>{totalCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {categories?.map((category: Category) => (
                  <Disclosure.Button
                    key={category.id}
                    as="a"
                    href={`category/${category.id}`}
                    className="block rounded-md px-3 py-2 text-base font-medium hover:bg-primaryColor hover:text-white"
                  >
                    {category.name}
                  </Disclosure.Button>
                ))}

                {/*  {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))} */}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div
        ref={panelRef}
        className={`fixed text-black inset-y-0 right-0 w-72 md:w-96 bg-white h-full transform transition-transform ${
          showCartPanel ? 'translate-x-0' : 'translate-x-full'
        } shadow-lg overflow-y-auto`}
      >
        {/* Content of the slide-out panel */}
        <div className="p-4 ">
          <div className="flex flex-row justify-between">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowCartPanel(!showCartPanel)}
            >
              <span className="text-gray-500 text-sm">close</span>
              <FaLongArrowAltRight size="25" />
            </div>
          </div>
          <hr className="m-4" />

          <CartModal />
        </div>
      </div>
    </>
  );
}
