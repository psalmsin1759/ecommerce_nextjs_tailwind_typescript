'use client';
import React from 'react';
import Header from '@/components/common/header';
import { Provider } from 'react-redux';
import { persistor, store } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { UserProvider } from '@/context/UserContext';

function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <UserProvider>
          <header className="fixed top-0 w-full z-50 bg-primaryColor text-white">
            <Header />
          </header>

          <main className="mt-20 bg-white">{children}</main>
        </UserProvider>
        {/*  </PersistGate> */}
      </Provider>
    </>
  );
}

export default DefaultLayout;
