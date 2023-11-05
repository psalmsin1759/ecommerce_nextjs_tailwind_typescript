import React, { useState, useEffect } from 'react';
import { User, useUser, updateUser } from '@/context/UserContext';
import axios from '@/api/axios';
import { Button } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import qs from 'qs';
import { Alert } from 'flowbite-react';

interface IFormInput {
  email: string;
  firstName: string;
  lastName: string;
}

function UpdateProfile() {
  const { state } = useUser();
  const { dispatch } = useUser();

  useEffect(() => {
    reset({
      firstName: state.user?.firstName,
      lastName: state.user?.lastName,
      email: state.user?.email,
    });
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
  });

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const onSubmit = async (data: IFormInput) => {
    setIsLoading(true);

    const input = {
      first_name: data.firstName,
      last_name: data.lastName,
    };

    const URL = '/customers/' + state.user?.id;

    const response = await axios.put(URL, qs.stringify(input), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    if (response?.data.success) {
      setIsLoading(false);

      updateUser(dispatch, {
        firstName: data.firstName,
        lastName: data.lastName,
      });

      setShowSuccessAlert(true);
    } else {
      setIsLoading(false);
      const message = response.data.message;
      alert(message);
    }
  };

  const dismissAlert = () => {
    setShowSuccessAlert(false);
  };

  return (
    <div className="p-2 flex flex-col gap-2">
      <span className="text-xl font-semibold">My Profile</span>

      {showSuccessAlert && (
        <Alert className="mt-2" color="success" onDismiss={dismissAlert}>
          <span className="font-medium">Profile Updated Successfully</span>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
            placeholder=""
            required
            {...register('firstName')}
          />
        </div>

        <div className="mb-2">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
        </div>

        <div className="mb-2">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
            placeholder=""
            required
            readOnly
            {...register('email')}
          />
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

export default UpdateProfile;
