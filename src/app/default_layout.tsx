'use client';
import React from 'react';
import Header from '@/components/common/header';
import { Provider } from 'react-redux';
import { persistor, store } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <>
          <header className="fixed top-0 w-full z-50 bg-white">
            <Header />
          </header>

          <main className="mt-20 bg-white">{children}</main>
        </>
        {/*  </PersistGate> */}
      </Provider>
    </>
  );
}

export default DefaultLayout;
