'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import Images from 'next/image';
import RelatedProductCard from '@/components/product/related_product_card';
import {
  getProductByID,
  Product,
  Variant,
  Image,
  RelatedProduct,
} from '@/model/Product';
import { Carousel } from 'flowbite-react';
import { Tabs } from 'flowbite-react';
import {
  BiLogoFacebook,
  BiLogoTwitter,
  BiLogoInstagramAlt,
} from 'react-icons/bi';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cart/cartSelector';
import imageBasePath from '@/components/common/path';
import { Modal } from 'flowbite-react';
import { addToWishList } from '@/model/wishlist';
import { useUser } from '@/context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductPage({ params }: { params: { id: number } }) {
  const [openModal, setOpenModal] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  const [selectedImage, setSelectedImage] = useState(
    'https://via.placeholder.com/500x750.png'
  );

  const handleImageClick = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  useEffect(() => {
    getProductByID(params.id)
      .then((productData) => {
        setProduct(productData);
        setRelatedProducts(productData.relatedproducts);
        setSelectedImage(productData.images[0].path);
      })
      .catch((error) => {
        console.error('Failed to fetch product:', error);
      });
  }, [params.id]);

  const [quantity, setQuantity] = useState(1); // Initialize the quantity state

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const [selectedOptions, setSelectedOptions] = useState<string>('');

  /* const handleVariantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const optionName = event.target.name; // Assuming you set the name attribute on your select element
    const optionValue = event.target.value;

    const newSelectedVariant = optionName + ' - ' + optionValue;
    setSelectedOptions(newSelectedVariant);
    console.log(newSelectedVariant);
    setSelectedVariant(optionValue);
  }; */

  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});

  const handleVariantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const optionName = event.target.name; // Assuming you set the name attribute on your select element
    const optionValue = event.target.value;

    console.log(optionName);
    console.log(optionValue);

    setSelectedVariants((prevState) => ({
      ...prevState,
      [optionName]: optionValue,
    }));
  };

  const dispatch = useDispatch();

  const handleAddToCart = (
    product: Product,
    quantity: number,
    options: { [key: string]: string }
  ) => {
    const selectedOptions = Object.entries(options)
      .map(([key, value]) => `${key} - ${value}`)
      .join(', ');

    if (!selectedOptions) {
      alert('Please select a variant before adding to cart');
      return;
    }
    toast('Added to cart!');
    console.log(selectedOptions);
    dispatch(addToCart(product, quantity, selectedOptions));
  };

  const groupVariantsByOption = () => {
    const groupedVariants: { [key: string]: Variant[] } = {};

    product?.variants.forEach((variant: Variant) => {
      if (!groupedVariants[variant.option]) {
        groupedVariants[variant.option] = [];
      }

      groupedVariants[variant.option].push(variant);
    });

    return groupedVariants;
  };

  const [sliderVisible, setSliderVisible] = useState(false);

  const toggleSlider = () => {
    setSliderVisible(!sliderVisible);
  };

  const redTheme = {
    base: 'flex flex-col gap-2',
    tablist: {
      base: 'flex text-center',
      styles: {
        default: 'flex-wrap border-b  dark:border-red-700', // Use red borders
        underline: 'flex-wrap -mb-px ', // Use red borders
        pills:
          'flex-wrap font-medium text-sm text-red-500 dark:text-red-400 space-x-2', // Use red text color
        fullWidth:
          'w-full text-sm font-medium divide-x shadow grid grid-flow-col dark:divide-red-700 dark:text-red-400 rounded-none', // Use red dividers
      },
      tabitem: {
        base: 'flex items-center justify-center p-4  text-lg font-medium first:ml-0 disabled:cursor-not-allowed hover:text-primaryColor  focus:outline-none',
        styles: {
          default: {
            base: 'rounded-t-lg',
            active: {
              on: ' text-red-600 dark:bg-red-800 dark:text-red-500', // Use red background and text color
              off: 'text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-800 dark:hover:text-red-300',
            },
          },
          underline: {
            active: {
              on: 'text-primaryColor border-b-2 border-primaryColor active dark:text-red-500 dark:border-red-500', // Use red borders and text color
              off: 'border-b-2 border-transparent ',
            },
          },
          pills: {
            base: '',
            active: {
              on: 'rounded-lg bg-red-600 text-white', // Use red background and white text for active
              off: 'rounded-lg hover:text-red-900 hover:bg-red-100 dark:hover:bg-red-800 dark:hover:text-white',
            },
          },
          fullWidth: {
            base: 'ml-0 first:ml-0 w-full rounded-none flex',
            active: {
              on: 'p-4 text-red-900 bg-red-100 active dark:bg-red-700 dark:text-white rounded-none', // Use red background, white text for active
              off: 'bg-red-50 hover:text-red-700 hover:bg-red-200 dark:hover:text-white dark:bg-red-800 dark:hover:bg-red-700 rounded-none',
            },
          },
        },
        icon: 'mr-2 h-5 w-5',
      },
    },
    tabitemcontainer: {
      base: '',
      styles: {
        default: '',
        underline: '',
        pills: '',
        fullWidth: '',
      },
    },
    tabpanel: 'py-3',
  };

  const { state } = useUser();

  async function addProductToWishlist(productName: string) {
    if (state.user) {
      const response = await addToWishList(state.user.id, product?.id ?? 0);
      alert(productName + ' add to wishlist');
    } else {
      alert('Please login to perform this operation');
    }
  }

  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoomChange = useCallback(
    (shouldZoom: boolean | ((prevState: boolean) => boolean)) => {
      setIsZoomed(shouldZoom);
    },
    []
  );

  return (
    <div className="mt-4 w-screen min-h-60">
      <div className=" bg-gray-100 w-screen items-center p-4">
        <Breadcrumb aria-label="Default breadcrumb  example">
          <Breadcrumb.Item href="#" icon={HiHome}>
            <p>Home</p>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Product</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="w-screen flex flex-col">
        <div className=" flex flex-col md:flex-row p-4 gap-1">
          <div className="w-full flex flex-col-reverse md:flex-row gap-4">
            <div className=" flex flex-row  md:w-28 md:flex-col gap-2 ">
              {product?.images?.slice(0, 4).map((image: Image) => (
                <div
                  className="border shadow mb-4 p-4"
                  key={image.id}
                  onClick={() => handleImageClick(image.path)}
                >
                  <Images
                    src={imageBasePath + 'product/' + image.path}
                    alt="..."
                    width={70}
                    height={95}
                    Object-cover
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            <div className="grow border shadow p-8">
              {product && product.images && product.images.length > 0 ? (
                <Images
                  src={imageBasePath + 'product/' + selectedImage}
                  alt={product.name}
                  width={170}
                  height={250}
                  Object-cover
                  className="w-full"
                />
              ) : (
                <div>
                  <Images
                    src={'/images/placeholder.png'}
                    alt="..."
                    width={170}
                    height={250}
                    Object-cover
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="w-full ml-4 mr-4">
            <span className="text-2xl font-semibold">
              {product?.name.toUpperCase()}
            </span>
            <div className="mt-4">
              <hr />
            </div>
            <div className="flex flex-row mt-4 gap-4">
              <span className="text-gray-500 text-sm">Product Code:</span>
              <span className=" text-sm font-semibold">{product?.sku}</span>
            </div>
            <div className="flex flex-row mt-2 gap-4">
              <span className="text-gray-500 text-sm">Availability:</span>
              {product ? (
                product.quantity > 0 ? (
                  <span className="text-sm font-semibold">Available</span>
                ) : (
                  <span className="text-sm font-semibold text-red-400">
                    Out of stock
                  </span>
                )
              ) : (
                <span className="text-sm font-semibold">
                  Product not available
                </span>
              )}
            </div>
            <div className="mt-4">
              <hr />
            </div>
            <div className="mt-6">
              <span className=" text-4xl font-semibold  text-primaryColor">
                ${product?.price}
              </span>
            </div>
            <div className="mt-4">
              <hr />
            </div>
            <div className="flex flex-row mt-4 gap-14 items-center">
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
            <div>
              {product?.variants && product?.variants.length > 0 && (
                <div className="mt-2">
                  <label htmlFor="variants">Product Options:</label>
                </div>
              )}

              {Object.entries(groupVariantsByOption()).map(
                ([option, variants], index) => (
                  <div
                    className="mt-2 flex flex-row  items-center w-full"
                    key={`${option}-${variants
                      .map((variant) => variant.id)
                      .join('-')}`}
                  >
                    <div className="w-20">
                      <span>{option}</span>
                    </div>

                    <div className="mt-2 ">
                      <select
                        className="pr-16 border rounded w-48"
                        id={`variant-${option}`}
                        name={option}
                        value={selectedVariants[option] || ''}
                        onChange={handleVariantChange}
                      >
                        <option value="">-- select option --</option>
                        {variants.map((variant: Variant, index) => (
                          <option
                            key={index}
                            value={variant.value}
                            disabled={variant.quantity === 0}
                          >
                            {variant.value}
                            {variant.quantity === 0 && ' - Out of stock'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )
              )}

              <div></div>
            </div>
            <div className="mt-4">
              <hr />
            </div>
            {product ? (
              product.quantity > 0 ? (
                <button
                  type="button"
                  onClick={() =>
                    handleAddToCart(product!, quantity, selectedVariants!)
                  }
                  className="flex flex-row gap-2 hover:bg-goldColor bg-black p-2 w-56 mt-4 justify-center items-center rounded-full cursor-pointer"
                >
                  <svg
                    className="w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    ></path>
                  </svg>
                  <span className="text-white text-lg">Add to cart</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="flex flex-row gap-2 bg-gray-300 p-2 w-56 mt-4 justify-center items-center rounded-full cursor-not-allowed"
                  disabled
                >
                  <span className="text-gray-600 text-lg">Out of Stock</span>
                </button>
              )
            ) : (
              <span className="text-sm font-semibold">
                Product not available
              </span>
            )}
            <ToastContainer />
            <div className="flex flex-row mt-4 gap-2 cursor-pointer">
              <button
                className="hover:text-primaryColor  cursor-pointer"
                onClick={() => addProductToWishlist(product!.name)}
              >
                Add to wishlist
              </button>{' '}
              <span
                className="text-primaryColor hover:text-goldColor cursor-pointer underline "
                onClick={() => setOpenModal(true)}
              >
                Size chart
              </span>
            </div>
            <div className="flex flex-row mt-4 items-center gap-2">
              <BiLogoFacebook size="30" />
              <BiLogoTwitter size="30" />
              <BiLogoInstagramAlt size="30" />
            </div>
          </div>
        </div>
      </div>
      <div className="border p-2 m-4 shadow w-full">
        <Tabs.Group
          aria-label="Default tabs"
          theme={redTheme}
          style="underline"
        >
          <Tabs.Item active title="Description">
            <div className="p-4">
              <span
                dangerouslySetInnerHTML={{ __html: product?.description ?? '' }}
              ></span>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Review">
            <div className="w-full p-2 flex flex-col justify-center items-center">
              <span className="text-xl">Write a review</span>
              <div className="w-full">
                <form>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                      placeholder="name@domain.com"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                      placeholder="John Kenedy"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Your Review
                    </label>

                    <textarea
                      id="message"
                      rows={4}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                      placeholder="Leave a comment..."
                    ></textarea>
                  </div>

                  <button type="submit" className="primaryColorButton">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </Tabs.Item>
        </Tabs.Group>
      </div>

      <div className="w-full flex items-center text-3xl mt-8 justify-center">
        <span>Related Products</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 m-2">
        {relatedProducts?.map((product: RelatedProduct, index) => (
          <RelatedProductCard key={index} product={product} />
        ))}
      </div>

      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Size Chart</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="w-full h-96">
              <Images
                src="/images/sizechart.jpg"
                alt="Size Chart"
                width={969}
                height={500}
                Object-cover
                className="w-full"
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ProductPage;
