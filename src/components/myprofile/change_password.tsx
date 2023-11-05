import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useUser } from '@/context/UserContext';
import qs from 'qs';
import { Alert } from 'flowbite-react';
import axios from '@/api/axios';

interface IFormInput {
  password: string;
  confirmPassword: string;
}

function ChangePassword() {
  const { state } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
  });

  const dismissAlert = () => {
    setShowSuccessAlert(false);
  };

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const onSubmit = async (data: IFormInput) => {
    setIsLoading(true);

    const input = {
      password: data.password,
      customerid: state.user?.id,
    };

    const URL = '/changeCustomerPassword';

    const response = await axios.post(URL, qs.stringify(input), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    if (response?.data.success) {
      setIsLoading(false);

      setShowSuccessAlert(true);
    } else {
      setIsLoading(false);
      const message = response.data.message;
      alert(message);
    }
  };

  return (
    <div className="p-2 flex flex-col gap-2">
      <span className="text-xl font-semibold">Change Password</span>

      {showSuccessAlert && (
        <Alert className="mt-2" color="success" onDismiss={dismissAlert}>
          <span className="font-medium">Password Updated Successfully</span>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            New Password
          </label>
          <input
            type="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
            placeholder=""
            required
            {...register('password')}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="mb-2">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Confirm Password
          </label>
          <input
            type="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
            placeholder=""
            required
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          isProcessing={isLoading}
          className="primaryColorButton mt-6 mb-6 w-52 hover:bg-goldColor"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default ChangePassword;
