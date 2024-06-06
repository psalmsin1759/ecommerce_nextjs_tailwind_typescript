'use client';
import React, { useEffect, useState } from 'react';
import axios from '@/api/axios';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import qs from 'qs';
import CheckoutForm from '@/components/stripe/CheckoutForm';
import { useOrder } from '@/context/OrderContext';

function PaymentPage() {
  // pk_test_51O44QgLg8sX8GRKLa9G1N2FCUkOZ1kqMyt9shcExY6jullUNnYiURQl1JeMpeECm6LtzrQdJBNmNE1dyx0Q1WLmw00zMFxWXsy

  //const stripePromise = loadStripe(process.env.STRIPE_API_KEY!);
  const stripePromise = loadStripe(
    'pk_test_51O44QgLg8sX8GRKLa9G1N2FCUkOZ1kqMyt9shcExY6jullUNnYiURQl1JeMpeECm6LtzrQdJBNmNE1dyx0Q1WLmw00zMFxWXsy'
  );
  console.log('key ' + process.env.STRIPE_API_KEY);
  const [clientSecret, setClientSecret] = useState('');
  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret: clientSecret,
  };

  const URL = '/create-payment-intent';
  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    const intentInput = {
      amount: 6,
    };

    const response = await axios.post(URL, qs.stringify(intentInput), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    setClientSecret(response.data.clientSecret);

    console.log('response: ' + response.data.clientSecret);
  };

  const { state } = useOrder();
  console.log(state.order?.email);

  return (
    <div className="w-screen mt-4 flex flex-col">
      <div className="w-full bg-gray-100  p-5 items-center ">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="#" icon={HiHome}>
            <p>Home</p>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">Payment</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className=" min-h-screen flex flex-col p-8 App  items-center">
        {clientSecret && (
          <div className="w-full border p-4  shadow md:w-1/2 ">
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;
