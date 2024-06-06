'use client';
import React from 'react';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import { Provider } from 'react-redux';
import { persistor, store } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { UserProvider } from '@/context/UserContext';
import { OrderProvider } from '@/context/OrderContext';

function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <UserProvider>
          <OrderProvider>
            <header className="fixed top-0 w-full z-50 bg-white text-black">
              <Header />
            </header>

            <main className="mt-20 bg-white">{children}</main>
            <footer className="bottom-0 w-full z-50 ">
              <Footer />
            </footer>
          </OrderProvider>
        </UserProvider>
        {/*  </PersistGate> */}
      </Provider>
    </>
  );
}

export default DefaultLayout;
