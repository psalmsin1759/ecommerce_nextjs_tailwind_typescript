import React, { useState } from 'react';
import { Tabs } from 'flowbite-react';
import Link from 'next/link';
import Autocomplete from 'react-google-autocomplete';
import countries from '@/json/country.json';

import axios from '@/api/axios';

// ** Third Party Imports
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import { User, useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

import qs from 'qs';

interface ILoginFormInput {
  email: string;
  password: string;
}

interface IRegistrationFormInput {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  address: string;
  //city?: string;
  state: string;
  //postalCode?: string;
  //phone?: string;
}
export default function Login() {
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
            registrationReset({
              //city: city,
              state: state,
              // postalCode: postalCode,
            });

            /*  reset({
                  city,
                  state,
                  postalCode,
                }); */

            //setCity(city);
            //setPlaceState(state);
            //setPostalCode(postalCode);
          }
        }
      );
    }
  };

  const router = useRouter();
  const { dispatch } = useUser();

  // Define the login schema using Yup
  const loginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required'),
  });

  const registerSchema = Yup.object().shape({
    firstname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required'),
    address: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    //city: Yup.string(),
    //postalCode: Yup.string(),
    //phone: Yup.string(),
  });

  const {
    register: loginRegister,
    handleSubmit: loginSubmit,
    reset: loginReset,
    formState: loginErrors,
  } = useForm<ILoginFormInput>({
    resolver: yupResolver(loginSchema),
  });

  const {
    register: registrationRegister,
    handleSubmit: registrationSubmit,
    reset: registrationReset,
    formState: registrationErrors,
  } = useForm<IRegistrationFormInput>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmitLogin = async (data: ILoginFormInput) => {
    const input = {
      email: data.email,
      password: data.password,
    };

    const URL = '/login';

    const response = await axios.post(URL, qs.stringify(input), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    if (response?.data.success) {
      const token = response.data.token;
      const userID = response.data.data.id;
      const firstName = response.data.data.first_name;
      const lastName = response.data.data.last_name;
      const email = response.data.data.email;
      const address = response.data.data.address;
      const city = response.data.data.city;
      const state = response.data.data.state;
      const postalCode = response.data.data.postal_code;
      const country = response.data.data.country;

      const user: User = {
        id: userID,
        firstName: firstName,
        lastName: lastName,
        email: email,
        address: address,
        city: city,
        state: state,
        postalCode: postalCode,
        country: country,
      };

      dispatch({ type: 'LOGIN', payload: user });

      router.push('/profile');
    } else {
      const message = response.data.message;
      alert(message);
    }
  };
  const onSubmitRegister = async (data: IRegistrationFormInput) => {
    console.log('regiser');
    const input = {
      first_name: data.firstname,
      last_name: data.lastname,
      email: data.email,
      //phone: data.phone,
      password: data.password,
      address: data.address,
      //city: data.city,
      //postal_code: data.postalCode,
      state: data.state,
      country: selectedCountry,
    };

    console.log(input);

    const URL = '/register';

    const response = await axios.post(URL, qs.stringify(input), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    if (response?.data.success) {
      const token = response.data.token;
      const userID = response.data.data.id;
      const firstName = response.data.data.first_name;
      const lastName = response.data.data.last_name;
      const email = response.data.data.email;
      const address = response.data.data.address;
      const city = response.data.data.city;
      const state = response.data.data.state;
      const postalCode = response.data.data.postal_code;
      const country = response.data.data.country;

      const user: User = {
        id: userID,
        firstName: firstName,
        lastName: lastName,
        email: email,
        address: address,
        city: city,
        state: state,
        postalCode: postalCode,
        country: country,
      };

      dispatch({ type: 'LOGIN', payload: user });

      router.push('/');
    } else {
      const message = response.data.message;
      alert(message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center m-8 ">
      <div className="w-full border p-4  shadow md:w-1/2 ">
        <Tabs.Group
          aria-label="Default tabs"
          theme={redTheme}
          style="underline"
        >
          <Tabs.Item active title="Login">
            <div className="w-full p-2 flex flex-col justify-center items-center">
              <span className="text-xl">LOGIN</span>
              <div className="w-full">
                <form onSubmit={loginSubmit(onSubmitLogin)}>
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
                      {...loginRegister('email')}
                    />
                    <span className="text-red-500">
                      {loginErrors.errors.email?.message}
                    </span>
                  </div>

                  <div className="mb-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                      placeholder=""
                      required
                      {...loginRegister('password')}
                    />
                    <span className="text-red-500">
                      {loginErrors.errors.password?.message}
                    </span>
                  </div>
                  <div className="mb-6 flex flex-row gap-2 items-center">
                    <input
                      type="checkbox"
                      id="myCheckbox"
                      name="myCheckbox"
                      className="text-primaryColor"
                    />
                    <label>Remember me</label>
                    <Link href={'/forgotpassword'}>
                      <span className="underline text-goldColor hover:text-primaryColor">
                        Forgot password?
                      </span>
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="primaryColorButton hover:bg-goldColor  mb-6"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Register">
            <div className="w-full p-2 flex flex-col justify-center items-center">
              <span className="text-xl">REGISTER</span>
              <div className="w-full">
                <form onSubmit={registrationSubmit(onSubmitRegister)}>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                      placeholder=""
                      required
                      {...registrationRegister('firstname')}
                    />
                    <span className="text-red-500">
                      {registrationErrors.errors.firstname?.message}
                    </span>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                      placeholder=""
                      required
                      {...registrationRegister('lastname')}
                    />
                    <span className="text-red-500">
                      {registrationErrors.errors.lastname?.message}
                    </span>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                      placeholder=""
                      required
                      {...registrationRegister('email')}
                    />
                    <span className="text-red-500">
                      {registrationErrors.errors.email?.message}
                    </span>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Password
                    </label>
                    <input
                      type="password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                      placeholder=""
                      required
                      {...registrationRegister('password')}
                    />
                    <span className="text-red-500">
                      {registrationErrors.errors.password?.message}
                    </span>
                  </div>

                  <div className="w-full mt-2 mb-2">
                    <hr />
                  </div>

                  <div className="w-full mt-2 mb-2">
                    <span className="text-lg">Billing Information</span>
                  </div>

                  <div className="md:flex md:flex-row md:gap-4">
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
                    <div className="w-full basis-1/2 mt-2">
                      <div className="w-full basis-1/2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Address
                        </label>
                        <Autocomplete
                          apiKey={apiKey}
                          options={{
                            types: ['(regions)'],
                            componentRestrictions: {
                              country: `${selectedCountry}`,
                            },
                          }}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
                          onPlaceSelected={handlePlaceSelected}
                          /*  {...registrationRegister('address')} */
                        />
                      </div>
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
                        /*  {...registrationRegister('city')} */
                      />
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
                        {...registrationRegister('state')}
                      />
                      <span className="text-red-500">
                        {registrationErrors.errors.state?.message}
                      </span>
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
                        /* {...registrationRegister('postalCode')} */
                      />
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
                        /*  {...registrationRegister('phone')} */
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="primaryColorButton mt-6 mb-6 hover:bg-goldColor"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
}
