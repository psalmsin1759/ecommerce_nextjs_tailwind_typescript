import React from 'react';

function ChangePassword() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <span className="text-xl font-semibold">Change Password</span>

      <div className="mb-2 mt-4">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          New Password
        </label>
        <input
          type="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primaryColor focus:border-primaryColor block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryColor dark:focus:border-primaryColor"
          placeholder=""
          required
        />
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
        />
      </div>

      <button
        type="submit"
        className="primaryColorButton mt-6 mb-6 w-52 hover:bg-goldColor"
      >
        Submit
      </button>
    </div>
  );
}

export default ChangePassword;
