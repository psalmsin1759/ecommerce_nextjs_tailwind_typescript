import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import imageBasePath from '@/components/common/path';

function BannerCard(_props: any) {
  // Determine the animation class based on the item's index
  const animationClass = _props.index === 0 ? 'left' : 'right';

  return (
    <motion.div className="bg-gray-200 h-300 rounded-lg overflow-hidden shadow-lg relative w-full">
      <Image
        src={imageBasePath + 'banner/' + _props.imagePath}
        alt=".."
        width={0}
        height={300}
        sizes="100vw"
        className="w-full h-full object-cover transition duration-300 ease-in-out hover:scale-110"
      />

      <div className="absolute top-8 md:top-10 left-8 w-1/2">
        <div className="flex flex-col gap-1">
          <span className="text-base md:text-xl  text-black-500 break-words block">
            {_props.title}
          </span>
          <span className="text-base md:text-2xl font-semibold text-black-500 break-words block line-clamp-2 ">
            {_props.subTitle}
          </span>

          <button
            type="button"
            className="rounded w-32 md:w-44 bg-goldColor text-white px-4 py-2  md:mt-6 hover:bg-primaryColor"
          >
            Shop Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default BannerCard;
