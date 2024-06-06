import { FAQs } from '@/model/faqs';
import React from 'react';
import { AiFillQuestionCircle } from 'react-icons/ai';

interface FAQsProps {
  faq: FAQs;
}
export default function FAQList({ faq }: FAQsProps) {
  return (
    <div className="w-full flex flex-col gap-2 p-4">
      <div className="flex flex-row gap-1 items-center">
        <AiFillQuestionCircle size={18} />
        <span className="text-lg font-semibold">{faq.question}</span>
      </div>

      <span className="text-gray-500">{faq.answer}</span>
    </div>
  );
}
