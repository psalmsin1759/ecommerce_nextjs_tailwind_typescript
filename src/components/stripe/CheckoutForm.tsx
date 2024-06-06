import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import { BsCreditCard2Back } from 'react-icons/bs';
import { AiOutlineLock } from 'react-icons/ai';
import { Button } from 'flowbite-react';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    //const storedOrderData = window.localStorage.getItem('orderData');
    let storedOrderData;

    if (typeof window !== 'undefined') {
      storedOrderData = window.localStorage.getItem('orderData');
    } else {
      storedOrderData = null; // Or assign a default value as needed
    }
    const orderData = JSON.parse(storedOrderData!);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url:
          'https://americafrontend.samsonude.dev/status?orderid=' +
          orderData.orderid +
          '&total=' +
          orderData.total_price +
          '&paymentgateway=Stripe',
      },
    });

    if (error) {
      setMessage(error.message!);
    } else {
      console.log('placeholder');
      //placeOrder();
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <div className="w-full flex flex-col items-center p-4">
      <div className="bg-primaryColor rounded p-4 ">
        <BsCreditCard2Back size={30} />
      </div>
      <span className="text-xl font-semibold mt-4">SECURE PAYMENT INFO</span>
      <div className="w-full">
        <form id="payment-form" onSubmit={handleSubmit}>
          <div className="mt-8 ">
            <PaymentElement
              className="mt-4"
              id="payment-element"
              options={paymentElementOptions}
            />
          </div>

          <Button
            className="w-full mt-8 mb-8 flex flex-col p-4 text-white text-lg font-semibold rounded justify-center items-center bg-primaryColor cursor-pointer hover:bg-goldColor"
            isProcessing={isLoading}
            id="submit"
            type="submit"
          >
            <div className="flex flex-row items-center gap-1">
              <AiOutlineLock size={20} /> <span>Pay now</span>
            </div>
          </Button>
          {/* Show any error or success messages */}
          {message && <div id="payment-message">{message}</div>}
        </form>
      </div>
    </div>
  );
}
