'use client';
import React, { useState, useEffect } from 'react';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineFieldTime,
} from 'react-icons/ai';
import { GrLocation } from 'react-icons/gr';

import { getStoreData, Store } from '@/model/store';

import { Button } from 'flowbite-react';
import axios from '@/api/axios';

import qs from 'qs';
// ** Third Party Imports
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import GoogleMapComp from '@/components/google/google_map';
import { Alert } from 'flowbite-react';

interface IFormInput {
  name: string;
  email: string;
  phone: string;
  message: string;
}

function ContactPage() {
  const [store, setStore] = useState<Store>({
    id: 0,
    name: '',
    address: '',
    state: '',
    country: '',
    geocode_latitude: '',
    geocode_longitude: '',
    email: '',
    phone: '',
    opening_times: '',
    aboutus: '',
    mission: '',
    vision: '',
    terms: '',
    privacy_policy: '',
    return_policy: '',
    refund_policy: '',
    favicon_path: '',
    logo_path: '',
    footer_logo_path: '',
    meta_title: '',
    meta_description: '',
    meta_tag_keywords: '',
    instagram_link: '',
    facebook_link: '',
    twitter_link: '',
    tiktok_link: '',
    payment_pub_key: '',
    payment_secret_key: '',
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      const data = await getStoreData();

      setStore(data);
    } catch (error) {
      console.error('Failed to fetch store:', error);
    }
  };

  const schema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    phone: Yup.string().required('Phone is required'),
    name: Yup.string().required('Name is required'),
    message: Yup.string().required('Message is required'),
  });

  const {
    register: register,
    handleSubmit: submit,
    reset: reset,
    formState: error,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [showAlert, setShowAlert] = useState(true);

  const onSubmit = async (data: IFormInput) => {
    setIsLoading(true);
    const input = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    };

    const URL = '/contactform';

    const response = await axios.post(URL, qs.stringify(input), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    if (response?.data.success) {
      reset({
        name: '',
        phone: '',
        message: '',
        email: '',
      });
      setFStatus('success');
      setMessage('success - We will get back to you shortly');
    } else {
      const message = response.data.message;
      setMessage(message);
      setFStatus('warning');
    }
    setShowAlert(true);
    setIsLoading(false);
  };

  const hideAlert = () => {
    // Hide the alert
    setShowAlert(false);
  };
  return (
    <div className="w-screen mt-4 flex flex-col">
      <div className="w-full bg-gray-100  p-5 items-center ">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="#" icon={HiHome}>
            <p>Home</p>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">Contact Us</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className=" min-h-screen flex flex-col p-8 gap-2">
        <span className="font-semibold text-primaryColor text-xl">
          Contact us
        </span>
        <span className="font-semibold text-3xl">Get in touch</span>
        <span className=" text-gray-500">
          Our friendly team is always here to chat.
        </span>
        <div className="w-full grid grid-cols-2 md:grid-cols-4 mt-4 bg-gray-100">
          <div className=" p-8 flex flex-col gap-2 bg-white ml-2 mt-2 mb-2">
            <AiOutlineMail size={30} />
            <span className="text-xl font-semibold">Email</span>
            <span className="text-gray-500 text-sm">
              Our friendly team is here to help
            </span>
            <span className="text-primaryColor">{store?.email}</span>
          </div>
          <div className=" p-8 flex flex-col gap-2 bg-white ml-2 mt-2 mb-2 mr-2">
            <GrLocation size={30} />
            <span className="text-xl font-semibold">Office</span>
            <span className="text-gray-500 text-sm">
              Come say hello at our shop.
            </span>
            <span className="text-primaryColor">{store?.address}</span>
          </div>
          <div className=" p-8 flex flex-col gap-2 bg-white ml-2 mt-2 mb-2 ">
            <AiOutlinePhone size={30} />
            <span className="text-xl font-semibold">Phone</span>
            <span className="text-gray-500 text-sm">
              Mon-Fri from 8am to 5pm
            </span>
            <span className="text-primaryColor">{store?.phone}</span>
          </div>
          <div className=" p-8 flex flex-col gap-2 bg-white ml-2 mt-2 mb-2 mr-2">
            <AiOutlineFieldTime size={30} />
            <span className="text-xl font-semibold">Opening Hours</span>
            <span className="text-gray-500 text-sm">
              Our friendly team is here to help
            </span>
            <span className="text-primaryColor">{store?.opening_times}</span>
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-2 mt-4 bg-gray-100">
          <div className="w-full bg-white m-2  p-8">
            <span className="text-2xl font-semibold mb-4">Contact us</span>
            {showAlert && (
              <Alert
                className={`showAlert}`}
                color={fStatus}
                onDismiss={hideAlert}
              >
                {message}
              </Alert>
            )}
            <div className="mt-4">
              <form onSubmit={submit(onSubmit)}>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your name
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                    placeholder="John"
                    required
                    {...register('name')}
                  />
                  <span className="text-red-500">
                    {error.errors.name?.message}
                  </span>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                    placeholder="name@domain.com"
                    required
                    {...register('email')}
                  />
                  <span className="text-red-500">
                    {error.errors.email?.message}
                  </span>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your Phone
                  </label>
                  <input
                    type="number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                    placeholder="0123456"
                    required
                    {...register('phone')}
                  />
                  <span className="text-red-500">
                    {error.errors.phone?.message}
                  </span>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your message
                  </label>
                  <textarea
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                    placeholder="Leave a message"
                    required
                    rows={5}
                    {...register('message')}
                  ></textarea>
                  <span className="text-red-500">
                    {error.errors.message?.message}
                  </span>
                </div>

                <Button
                  type="submit"
                  isProcessing={isLoading}
                  className="primaryColorButton hover:bg-goldColor  mb-6"
                >
                  Submit
                </Button>
              </form>
            </div>
          </div>
          <div className="w-full bg-white m-2 p-8">
            <span className="text-2xl font-semibold mb-4">Map</span>
            <GoogleMapComp />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
