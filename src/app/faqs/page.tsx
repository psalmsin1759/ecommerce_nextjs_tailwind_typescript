'use client';
import React, { useEffect, useState } from 'react';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import { FAQs, getFaqs } from '@/model/faqs';
import FAQList from '@/components/faq/faq_list';

function FaqsPage() {
  const [faqs, setFaqs] = useState<FAQs[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const fqs = await getFaqs();
    setFaqs(fqs);
  };

  return (
    <div className="w-screen mt-4 flex flex-col">
      <div className="w-full bg-gray-100  p-5 items-center ">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="#" icon={HiHome}>
            <p>Home</p>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">FAQs</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className=" min-h-screen flex flex-col p-8">
        <span className="text-3xl font-semibold">
          Frequently asked questions
        </span>

        <div className="p-2 grid grid-cols-1 md:grid-cols-2">
          {faqs.map((faq: FAQs, index) => (
            <FAQList key={index} faq={faq} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FaqsPage;
