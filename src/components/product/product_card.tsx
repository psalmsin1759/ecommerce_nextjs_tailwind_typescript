'use client';
import React, { useState } from 'react';
import { Product } from '@/model/Product';
import Image from 'next/image';
import { Rating } from 'flowbite-react';
import { AiOutlineHeart, AiOutlineSearch } from 'react-icons/ai';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Modal } from 'flowbite-react';
import { Carousel } from 'flowbite-react';
import Link from 'next/link';
import { Alert } from 'flowbite-react';
import imageBasePath from '@/components/common/path';
import { addToWishList } from '@/model/wishlist';
import { useUser } from '@/context/UserContext';

import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cart/cartSelector';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const [openModal, setOpenModal] = useState<string | undefined>();
  const props = { openModal, setOpenModal };
  const isAvailable = product.in_stock > 0;

  const [quantity, setQuantity] = useState(1); // Initialize the quantity state

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  function handleWishlist(productName: string, productId: number) {
    alert(productName + ' add to wishlist');
  }

  const dispatch = useDispatch();
  const handleAddToCart = () => {
    dispatch(addToCart(product, quantity, ''));
  };

  const { state } = useUser();

  async function addProductToWishlist(productName: string) {
    if (state.user) {
      const response = await addToWishList(state.user.id, product.id);
      alert(productName + ' add to wishlist');
    } else {
      alert('Please login to perform this operation');
    }
  }
  return (
    <>
      <div className="w-fullh-250 border-2  flex flex-col items-center  relative group hover:border-primaryColor hover:border-2">
        <div className="w-full h-200 group relative p-2 md:p-4">
          <Link href={`/product/${product.id}`}>
            <Image
              src={imageBasePath + 'product/' + product.images[0]?.path}
              alt={product.name}
              width={170}
              height={250}
              Object-cover
              className="w-full"
            />
          </Link>
        </div>

        <div className="w-full p-4 flex flex-col items-center justify-center">
          <Rating>
            <Rating.Star />
            <Rating.Star />
            <Rating.Star />
            <Rating.Star />
            <Rating.Star />
            {/* <Rating.Star filled={false} /> */}
          </Rating>

          <div className="w-full text-center">
            <Link href={`/product/${product.id}`}>
              <span className=" text-sm md:text-lg hover:text-primaryColor line-clamp-2">
                {product.name.toUpperCase()}
              </span>
            </Link>
          </div>

          {product.discounted_price > 0 ? (
            <div className="flex flex-col md:flex-row md:gap-2  items-center">
              <span className="text-base md:text-xl font-semibold">
                £‌{product.discounted_price}
              </span>
              <del>
                {' '}
                <span className="text-base md:text-xl text-gray-500">
                  £‌{product.price}
                </span>
              </del>
            </div>
          ) : (
            <span className="text-base md:text-xl font-semibold">
              £‌{product.price}
            </span>
          )}
        </div>
        <div className="absolute top-64 left-0 right-0 flex flex-row gap-2 justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            className="whiteToPrimaryColorButton px-4 py-2 shadow"
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
          <button
            type="button"
            className="whiteToPrimaryColorButton p-2 shadow"
            onClick={() => addProductToWishlist(product.name)}
          >
            <AiOutlineHeart size="24" />
          </button>
          <button
            type="button"
            className="whiteToPrimaryColorButton p-2 shadow"
            onClick={() => props.setOpenModal('default')}
          >
            <AiOutlineSearch size="24" />
          </button>
        </div>
        {product.new_arrival === 1 && (
          <div className="absolute top-2 left-2 text-sm md:text-base md:top-4 md:left-4 bg-primaryColor text-white px-2 py-1 shadow">
            <span>New</span>
          </div>
        )}
      </div>

      <Modal
        dismissible
        size="6xl"
        show={props.openModal === 'default'}
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header>QuickView</Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="relative md:grid md:grid-cols-2 px-1 flex-auto">
              <div className="w-full border shadow p-2">
                <Carousel slideInterval={3000}>
                  {product.images.map((image, index) => (
                    <Image
                      key={index}
                      src={imageBasePath + 'product/' + image.path}
                      alt={product.name}
                      width={170}
                      height={250}
                      Object-cover
                      className="w-full relative"
                    />
                  ))}
                </Carousel>
              </div>
              <div className="w-full pl-4">
                <span className="text-3xl font-semibold ">{product.name}</span>
                <div className="mt-4">
                  <span className="mr-2">SKU: </span>
                  <span>{product.sku}</span>
                </div>
                <div className="mt-4">
                  <span className="mr-2">Availability: </span>
                  {isAvailable ? <span>Instock</span> : <span>Sold out</span>}
                </div>
                <hr className="mt-4 mb-4" />
                <span className="text-2xl mt-4 mb-4 font-semibold">
                  £‌{product.price}
                </span>
                <hr className="mt-4" />
                <div className="flex flex-row mt-4 gap-4 items-center">
                  <span className="text-gray-500 text-sm">Qty:</span>
                  <div className="rounded-full w-32 pl-4 pr-4 pt-2 pb-2 border-2 flex flex-row items-center justify-between gap-2">
                    <button type="button" onClick={increaseQuantity}>
                      <svg
                        className="w-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 6v12m6-6H6"
                        ></path>
                      </svg>
                    </button>
                    <span>{quantity}</span>
                    <button type="button" onClick={decreaseQuantity}>
                      <svg
                        className="w-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M18 12H6"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <hr />
                </div>
                <div className="mt-4 flex gap-1">
                  <button
                    onClick={handleAddToCart}
                    className="primaryColorButton"
                  >
                    Add to cart
                  </button>
                  <button className="primaryColorButtonNoPadding p-2">
                    {' '}
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="mt-4 flex flex-row gap-1">
                  <FaFacebookF size="26" />
                  <FaTwitter size="26" />
                  <FaInstagram size="26" />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProductCard;
