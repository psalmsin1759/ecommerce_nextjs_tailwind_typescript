'use client';
import React, { useState } from 'react';
import axios from '@/api/axios';
// ** Third Party Imports
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'flowbite-react';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import { Alert } from 'flowbite-react';

import qs from 'qs';

interface IFormInput {
  email: string;
}

function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [showAlert, setShowAlert] = useState(true);
  const schema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
  });

  const {
    register: register,
    handleSubmit: submit,
    reset: reset,
    formState: error,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: IFormInput) => {
    setIsLoading(true);
    const input = {
      email: data.email,
    };

    const URL = '/forgotpassword';
    const response = await axios.post(URL, qs.stringify(input), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    if (response?.data.success) {
      reset({
        email: '',
      });
      setFStatus('success');
      setMessage(
        'success - An email has been sent to your account to reset your password'
      );
    } else {
      const message = response.data.message;
      //alert(message);
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
    <div className="flex flex-col justify-center items-center">
      <div className="w-full bg-gray-100  p-5 items-center ">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="#" icon={HiHome}>
            <p>Home</p>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">Forgot Password</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="w-full border p-4 mb-10 mt-10 ml-2 mr-2 shadow md:w-1/2 ">
        <div className="w-full p-2 flex flex-col justify-center items-center ">
          {showAlert && (
            <Alert
              className={`showAlert}`}
              color={fStatus}
              onDismiss={hideAlert}
            >
              {message}
            </Alert>
          )}
          <span className="text-xl">Forgot Password</span>
          <span className="text-sm">
            Enter your email and we will send you a link to reset your password.
          </span>
          <div className="w-full">
            <form onSubmit={submit(onSubmit)}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                  placeholder=""
                  required
                  {...register('email')}
                />
                <span className="text-red-500">
                  {error.errors.email?.message}
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
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
