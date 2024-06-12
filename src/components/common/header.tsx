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
      const data = await getAllCategories();

      const mainCategories = data.filter(
        (category) => category.parent_id === 0
      );
      setCategories(mainCategories);
      setSubcategories(data.filter((category) => category.parent_id !== 0));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };
  const router = useRouter();

  const { state } = useUser();

  let userData: string | null;

  if (typeof window !== 'undefined') {
    // This code will only run in a browser environment
    userData = window.localStorage.getItem('userData');
  } else {
    // Handle the case when it's not running in a browser (e.g., server-side rendering)
    userData = null; // Or assign a default value as needed
  }

  const { dispatch } = useUser();

  const handleLogout = () => {
    // const { dispatch } = useUser();
    console.log('logout');
    dispatch({ type: 'LOGOUT' });
    router.replace('/login');
  };

  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const handleCategoryClick = (categoryId: number) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null); // Collapse subcategories
    } else {
      setActiveCategory(categoryId); // Expand subcategories
    }

    // Close the existing submenu
    setExpandedSubcategories([]);
  };

  const [expandedSubcategories, setExpandedSubcategories] = useState<number[]>(
    []
  );

  const handleSubcategoryClick = (subcategoryID: number) => {
    // Toggle the expansion state of the clicked subcategory
    if (expandedSubcategories.includes(subcategoryID)) {
      setExpandedSubcategories(
        expandedSubcategories.filter((id) => id !== subcategoryID)
      );
    } else {
      setExpandedSubcategories([...expandedSubcategories, subcategoryID]);
    }
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
                <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-primaryColor hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <AiOutlineMenu
                        className="block h-6 w-6 "
                        aria-hidden="true"
                      />
                    )}
                  </Disclosure.Button>
                </div>

                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="ml-6 flex flex-shrink-0 items-center">
                    <Link href={'/'}>
                      <Image
                        className=" "
                        src={'/images/bakerslogo.png'}
                        alt="Logo"
                        width={204}
                        height={55}
                      />
                    </Link>
                  </div>

                  <div className="hidden sm:ml-6 md:block ">
                    <div className="flex mt-4 space-x-4">
                      {categories.map((category: Category, index) => (
                        <div
                          key={index}
                          className="relative hover:font-semibold rounded-md px-3 py-2 text-md font-medium cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-0">
                            <Link
                              href={`/category/${category.id}`}
                              className="hover:font-semibold rounded-md px-2 py-2 text-md font-medium"
                              aria-current="page"
                            >
                              {category.name}
                            </Link>

                            {subcategories.some(
                              (subcategory) =>
                                subcategory.parent_id === category.id
                            ) && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-4 h-4 ${
                                  expandedSubcategories.includes(category.id)
                                    ? 'transform rotate-180'
                                    : ''
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                onClick={() =>
                                  handleSubcategoryClick(category.id)
                                }
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            )}
                          </div>
                          <div
                            className={`${
                              expandedSubcategories.includes(category.id)
                                ? 'block'
                                : 'hidden'
                            } w-full bg-white border border-gray-300 rounded-lg absolute z-10`}
                          >
                            {subcategories
                              .filter(
                                (subcategory) =>
                                  subcategory.parent_id === category.id
                              )
                              .map((subcategory, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 cursor-pointer bg-white"
                                >
                                  <Disclosure.Button
                                    as={Link}
                                    href={`/category/${subcategory.id}`}
                                  >
                                    {subcategory.name}
                                  </Disclosure.Button>
                                  {/* <Link
                                    key={subcategory.id}
                                    href={`/category/${subcategory.id}`}
                                    className="text-black hover:text-primaryColor hover:font-semibold rounded-md px-3 py-2 text-md font-medium"
                                    aria-current="page"
                                  >
                                    {subcategory.name}
                                  </Link> */}
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="hidden md:block">
                    <BiSearch size="30" />
                  </div>

                  <Dropdown
                    renderTrigger={() => (
                      <span>
                        <FaRegUser className=" cursor-pointer" size="26" />
                      </span>
                    )}
                    label={'undefined'}
                  >
                    {userData ? ( // Check if the user is logged in
                      <>
                        <Dropdown.Item>
                          <Disclosure.Button as={Link} href={`/profile`}>
                            My Account
                          </Disclosure.Button>
                        </Dropdown.Item>
                        <Dropdown.Item></Dropdown.Item>
                        <Dropdown.Item>
                          <Disclosure.Button as={Link} href={`/profile`}>
                            Wishlist
                          </Disclosure.Button>
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
                          <Disclosure.Button as={Link} href={`/login`}>
                            Register
                          </Disclosure.Button>
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <Disclosure.Button as={Link} href={`/login`}>
                            Login
                          </Disclosure.Button>
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
                  <div
                    key={category.id}
                    className=" flex flex-col  cursor-pointer border-b p-4 hover:bg-primaryColor"
                    onClick={handleCategoryClick.bind(null, category.id)}
                  >
                    <div className="flex items-center justify-between">
                      {/*  <Link
                        key={category.id}
                        href={`/category/${category.id}`}
                        className="text-black-900 hover:font-semibold rounded-md  text-md font-medium"
                        aria-hidden="true"
                      >
                        {category.name}
                      </Link> */}

                      <Disclosure.Button
                        as={Link}
                        href={`/category/${category.id}`}
                      >
                        {category.name}
                      </Disclosure.Button>

                      {subcategories.some(
                        (subcategory) => subcategory.parent_id === category.id
                      ) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`w-4 h-4 ${
                            activeCategory === category.id
                              ? 'transform rotate-180'
                              : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </div>

                    <div
                      className={`${
                        activeCategory === category.id ? 'block' : 'hidden'
                      }  w-full`}
                    >
                      {subcategories
                        .filter(
                          (subcategory) => subcategory.parent_id === category.id
                        )
                        .map((subcategory) => (
                          <div
                            key={subcategory.id}
                            className="cursor-pointer mt-2 hover:text-white "
                          >
                            <Disclosure.Button
                              as={Link}
                              href={`/category/${subcategory.id}`}
                            >
                              {subcategory.name}
                            </Disclosure.Button>
                            {/* <Link
                              key={subcategory.id}
                              href={`/category/${subcategory.id}`}
                              className=" hover:font-semibold rounded-md hover:text-black  text-md font-medium "
                              aria-hidden="true"
                            >
                              {subcategory.name}
                            </Link> */}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
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

          <CartModal setShowCartPanel={setShowCartPanel} />
        </div>
      </div>
    </>
  );
}
