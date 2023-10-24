'use client';
import React, { useState, useEffect } from 'react';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import Footer from '@/components/common/footer';
import Autocomplete from 'react-google-autocomplete';
import countries from '@/json/country.json';
import { GoCheckCircleFill } from 'react-icons/go';
import CartCheckoutList from '@/components/cart/cart_checkout_list';
import { useSelector, useDispatch } from 'react-redux';
import axios from '@/api/axios';
import {
  selectCartItems,
  selectTotalGrandPrice,
} from '@/redux/cart/cartSelector';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Coupon, applyCoupon } from '@/model/coupon';

import { loadStripe, Stripe } from '@stripe/stripe-js';
import {
  CardElement,
  useElements,
  useStripe,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  Elements,
} from '@stripe/react-stripe-js';

declare const google: any;

type ShippingMethod = 'Standard' | 'Express';

interface IFormInput {
  email: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

//const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe(
  'pk_test_51O44QgLg8sX8GRKLa9G1N2FCUkOZ1kqMyt9shcExY6jullUNnYiURQl1JeMpeECm6LtzrQdJBNmNE1dyx0Q1WLmw00zMFxWXsy'
);

const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#c4f0ff',
      color: 'black',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': { color: 'black' },
      '::placeholder': { color: 'black' },
    },
    invalid: {
      iconColor: '#ffc7ee',
      color: 'black',
    },
  },
};

function CheckoutPage() {
  const [apiKey, setAPIKey] = useState(
    'AIzaSyCfA2rPPQFxQzT4f__r9DIU3_k9-Z8K-68'
  );

  const [selectedCountry, setSelectedCountry] = useState<string>('GB');

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    console.log('placeid' + place.place_id);
    if (place.place_id) {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      service.getDetails(
        { placeId: place.place_id },
        (placeDetails: any, status: google.maps.places.PlacesServiceStatus) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const addressComponents = placeDetails.address_components;

            // Initialize variables to store city, state, and postal code
            let city = '';
            let state = '';
            let postalCode = '';

            // Iterate through address components to find the desired data
            for (const component of addressComponents) {
              if (component.types.includes('locality')) {
                city = component.long_name;
              } else if (
                component.types.includes('administrative_area_level_1')
              ) {
                state = component.long_name;
              } else if (component.types.includes('postal_code')) {
                postalCode = component.long_name;
              }
            }

            reset({
              city,
              state,
              postalCode,
            });

            //setCity(city);
            //setPlaceState(state);
            //setPostalCode(postalCode);
          }
        }
      );
    }
  };

  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const grandTotal = useSelector(selectTotalGrandPrice);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    city: Yup.string().required('city is required'),
    state: Yup.string().required('State is required'),
    postalCode: Yup.string().required('Postal Code is required'),
    phone: Yup.string().required('Phone is required'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
  });

  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<ShippingMethod>('Standard');

  // Define the shipping cost for each method
  const shippingCosts = {
    Standard: 5,
    Express: 16,
  };

  // Calculate the shipping cost based on the selected method
  const shippingCost = shippingCosts[selectedShippingMethod];

  const [total, setTotal] = useState<number>(
    parseFloat(grandTotal) + shippingCost
  );

  const [discount, setDiscount] = useState<number>(0);
  // Handle changes in the selected shipping method
  const handleShippingMethodChange = (method: ShippingMethod) => {
    setSelectedShippingMethod(method);

    // Calculate the new total based on the selected shipping method
    const newShippingCost = shippingCosts[method];
    setTotal(parseFloat(grandTotal) + newShippingCost - discount);
  };

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const applyCouponHandler = async () => {
    try {
      if (!couponCode) {
        setCouponError('Coupon code is required.');
        return;
      }

      //setDiscount(0);
      setCouponError('');
      const appliedCoupon = await applyCoupon(couponCode);

      setAppliedCoupon(appliedCoupon);

      if (appliedCoupon.type === 'fixed') {
        const dis = appliedCoupon.value;
        setDiscount(dis);
        console.log(discount);
        const newTotal = parseFloat(grandTotal) + shippingCost - discount;
        setTotal(newTotal);
      } else if (appliedCoupon.type === 'percentage') {
        const dis = (appliedCoupon.value / 100) * parseFloat(grandTotal);
        setDiscount(dis);
        console.log(discount);
        const newTotal = parseFloat(grandTotal) + shippingCost - discount;
        setTotal(newTotal);
      }
    } catch (error) {
      setCouponError('Invalid');
    }
  };

  const [clientSecret, setClientSecret] = useState('');

  const onSubmit = async (data: IFormInput) => {
    console.log(JSON.stringify(data, null, 2));

    console.log('shipping method: ' + selectedShippingMethod);
    console.log('shipping cost: ' + shippingCost);
    console.log('selected country: ' + selectedCountry);

    const stripe = useStripe();
    const elements = useElements();

    /*   const { error, paymentMethod } = await stripe?.createPaymentMethod({
      type: 'card',
      card: elements.getElement(
        CardCvcElement,
        CardExpiryElement,
        CardNumberElement
      ),
    });


    const {error} = await stripe?.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      clientSecret,
      confirmParams: {
        return_url: 'https://example.com/order/123/complete',
      },
    }); */

    const responseData = await axios.post('create-payment-intent', {
      data: { amount: 89 },
    });

    const clientSecret = responseData;

    /*  await stripe?.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    }); */
  };

  return (
    <div className="mt-4 w-full min-h-60">
      <div className=" bg-gray-100 w-full p-5 items-center ">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="#" icon={HiHome}>
            <p>Home</p>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Checkout</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row m-4 p-4 gap-8">
          <div className="basis-2/3">
            <span className="text-lg mb-6 font-semibold">
              Contact Information
            </span>
            <div className="mb-6">
              <label className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                placeholder=""
                required
                {...register('email')}
              />
              <span className="text-red-500">{errors.email?.message}</span>
            </div>
            <div className="mt-2 mb-2">
              <hr />
            </div>
            <span className="text-lg mb-6 font-semibold">
              Shipping Information
            </span>
            <div className="mb-6 md:flex md:flex-row md:gap-4">
              <div className="w-full basis-1/2">
                <label className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                  placeholder=""
                  required={true}
                  {...register('firstName')}
                />
                <span className="text-red-500">
                  {errors.firstName?.message}
                </span>
              </div>
              <div className="w-full basis-1/2">
                <label className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                  placeholder=""
                  required
                  {...register('lastName')}
                />
                <span className="text-red-500">
                  {' '}
                  {errors.lastName?.message}
                </span>
              </div>
            </div>
            <div className=" md:flex md:flex-row md:gap-4">
              <div className="w-full basis-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Country
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full basis-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Address
                </label>
                <Autocomplete
                  apiKey={apiKey}
                  options={{
                    types: ['(regions)'],
                    componentRestrictions: { country: `${selectedCountry}` },
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                  onPlaceSelected={handlePlaceSelected}
                />
              </div>
            </div>
            <div className="md:flex md:flex-row md:gap-4">
              <div className="w-full basis-1/2">
                <label className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                  placeholder=""
                  required={true}
                  {...register('city')}
                />
                <span className="text-red-500">{errors.city?.message}</span>
              </div>
              <div className="w-full basis-1/2">
                <label className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">
                  State / Province
                </label>
                <input
                  type="text"
                  id="state"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                  placeholder=""
                  required={true}
                  {...register('state')}
                />
                <span className="text-red-500">{errors.state?.message}</span>
              </div>
            </div>
            <div className=" md:flex md:flex-row md:gap-4">
              <div className="w-full basis-1/2">
                <label className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">
                  Postal code
                </label>
                <input
                  type="text"
                  id="postalcode"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                  placeholder=""
                  required={true}
                  {...register('postalCode')}
                />
                <span className="text-red-500">
                  {errors.postalCode?.message}
                </span>
              </div>
              <div className="w-full basis-1/2">
                <label className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                  placeholder=""
                  required={true}
                  {...register('phone')}
                />
                <span className="text-red-500">{errors.phone?.message}</span>
              </div>
            </div>
            <div className="mt-4 mb-2">
              <hr />
            </div>
            <span className="text-lg mb-6 font-semibold">Delivery Method</span>
            <div className="mt-4 mb-2 flex flex-row gap-4">
              <div
                className={`basis-1/2 flex flex-col p-4 border-2 border-gray-100 ${
                  selectedShippingMethod === 'Standard'
                    ? 'border-3 border-primaryColor'
                    : ''
                }`}
                onClick={() => handleShippingMethodChange('Standard')}
              >
                <div className="flex flex-row justify-between">
                  <span className="text-lg">Standard</span>
                  {selectedShippingMethod === 'Standard' && (
                    <GoCheckCircleFill
                      size="20"
                      className="text-primaryColor"
                    />
                  )}
                </div>
                <span className="text-gray-500 mb-5">10 business days</span>
                <span className="">$5.00</span>
              </div>
              <div
                className={`basis-1/2 flex flex-col p-4 border-2 border-gray-100 ${
                  selectedShippingMethod === 'Express'
                    ? 'border-3 border-primaryColor'
                    : ''
                }`}
                onClick={() => handleShippingMethodChange('Express')}
              >
                <div className="flex flex-row justify-between">
                  <span className="text-lg">Express</span>
                  {selectedShippingMethod === 'Express' && (
                    <GoCheckCircleFill
                      size="20"
                      className="text-primaryColor"
                    />
                  )}
                </div>
                <span className="text-gray-500 mb-5">2–5 business days</span>
                <span className="">$16.00</span>
              </div>
            </div>
            <div className="mt-4 mb-2">
              <hr />
            </div>
            <span className="text-lg mb-4 font-semibold">
              Payment Information
            </span>
            <Elements stripe={stripePromise}>
              <div className="mt-4 mb-2 flex flex-row gap-4">
                <div className="w-full basis-1/2">
                  <label className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">
                    Card Number
                  </label>
                  <CardNumberElement className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor" />
                </div>
                <div className="w-full basis-1/2">
                  <label className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">
                    CVV
                  </label>
                  <CardCvcElement className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor" />
                </div>
              </div>
              <div className="mt-4 mb-2 flex flex-row gap-4">
                <div className="w-full basis-1/2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Expiration date (MM/YY)
                  </label>
                  <CardExpiryElement className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor" />
                </div>
                <div className="w-full basis-1/2"></div>
              </div>
            </Elements>
          </div>

          <div className="basis-1/3 bg-gray-100 rounded p-6 shadow flex flex-col gap-1">
            {cartItems.map((cartItem) => (
              <CartCheckoutList product={cartItem} />
            ))}

            <span className="text-lg font-semibold">Coupon Code</span>
            <span className="text-sm text-gray-500">
              Enter code to get discount instantly
            </span>
            <div className="w-full border-2 bg-white flex flex-row p-2 mt-1   dark:focus:ring-primaryColor dark:focus:border-primaryColor">
              <input
                type="text"
                id="coupon"
                className="  text-gray-900 text-sm  w-full p-2.5 border-transparent focus:ring-transparent focus:border-transparent"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button
                type="button"
                onClick={applyCouponHandler}
                className="text-white rounded bg-black hover:bg-primaryColor pl-4 pr-4 pt-2 pb-2"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <div>
                <span>Applied Coupon:</span>
                <span>{appliedCoupon.code}</span>
              </div>
            )}
            {couponError && <div className="text-red-500">{couponError}</div>}
            <div className="flex flex-row justify-between mt-8">
              <span>Subtotal</span>
              <span className="font-semibold">${grandTotal}</span>
            </div>
            <div className="flex flex-row justify-between mt-6">
              <span>Shipping</span>
              <span className="font-semibold">+ ${shippingCost}</span>
            </div>

            <div className="flex flex-row justify-between mt-6">
              <span>Discount</span>
              <span className="font-semibold">- ${discount}</span>
            </div>
            <div className="m-2 w-full mt-4">
              <hr className=" h-px bg-gray-300" />
            </div>
            <div className="flex flex-row justify-between mt-4">
              <span>Total</span>
              <span className="font-semibold text-xl">${total.toFixed(2)}</span>
            </div>
            <div className="m-2 w-full mt-4">
              <hr className=" h-px bg-gray-300" />
            </div>

            <button
              type="submit"
              className="w-full mt-8 flex flex-col p-4 text-white text-lg font-semibold rounded justify-center items-center bg-primaryColor cursor-pointer hover:bg-black"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </form>

      <Footer />
    </div>
  );
}

export default CheckoutPage;
