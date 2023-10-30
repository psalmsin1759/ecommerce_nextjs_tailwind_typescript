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
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cart/cartSelector';

interface ProductCardProps {
  product: Product;
}

function ProductListCard({ product }: ProductCardProps) {
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

  return (
    <>
      <div className="w-full h-250 border-2 gap-2  flex flex-row items-center  relative group hover:border-primaryColor hover:border-2 m-4">
        <div className=" h-200 group relative p-4">
          <Link href={`/product/${product.id}`}>
            <Image
              src={product.images[0]?.path}
              alt={product.name}
              width={170}
              height={250}
              className="w-56"
            />
          </Link>
        </div>
        <div className="w-full p-4 flex flex-col items-start gap-2">
          <Rating>
            <Rating.Star />
            <Rating.Star />
            <Rating.Star />
            <Rating.Star />
            <Rating.Star />
            {/* <Rating.Star filled={false} /> */}
          </Rating>

          <Link href={`/product/${product.id}`}>
            <span className="text-lg hover:text-primaryColor">
              {product.name.toUpperCase()}
            </span>
          </Link>
          <span className="text-md text-gray-300 line-clamp-2 ">
            {product.description}
          </span>

          {product.discounted_price !== 0 ? (
            <div className="flex flex-row gap-2 items-center">
              <span className="text-xl font-semibold">
                ₦{product.discounted_price}
              </span>
              <del>
                {' '}
                <span className="text-md text-gray-500">₦{product.price}</span>
              </del>
            </div>
          ) : (
            <span className="text-xl font-semibold">₦{product.price}</span>
          )}

          <div className="flex flex-row gap-2 justify-center">
            <button
              type="button"
              className="primaryColorButtonNoPadding pl-8 pr-8 pt-2 pb-2 shadow"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
            <button
              type="button"
              className="primaryColorButtonNoPadding p-2 shadow"
              onClick={() => handleWishlist(product.name, product.id)}
            >
              <AiOutlineHeart size="26" />
            </button>
            <button
              type="button"
              className="primaryColorButtonNoPadding p-2 shadow"
              onClick={() => props.setOpenModal('default')}
            >
              <AiOutlineSearch size="26" />
            </button>
          </div>
        </div>
      </div>
      <Modal
        dismissible
        size="6xl"
        show={props.openModal === 'default'}
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header>QuickView</Modal.Header>
        <Modal.Body>
          <div className="space-y-3">
            <div className="relative md:grid md:grid-cols-2  p-4 flex-auto">
              <div className="w-full border shadow p-2">
                <Carousel>
                  {product.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image.path}
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
                <span className="text-3xl font-semibold">{product.name}</span>
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
                  ₦{product.price}
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

export default ProductListCard;
