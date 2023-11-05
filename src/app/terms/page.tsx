'use client';
import React, { useState, useEffect } from 'react';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import Footer from '@/components/common/footer';
import { getStoreData, Store } from '@/model/store';

function TermsPage() {
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

  return (
    <div className="w-screen mt-4 flex flex-col">
      <div className="w-full bg-gray-100  p-5 items-center ">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="#" icon={HiHome}>
            <p>Home</p>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">Terms And Conditions</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className=" min-h-screen flex flex-col p-8">
        <span className="text-3xl font-semibold">Terms And Conditions</span>
        <span
          className="mt-4"
          dangerouslySetInnerHTML={{ __html: store.terms }}
        ></span>
      </div>
      <Footer />
    </div>
  );
}

export default TermsPage;
