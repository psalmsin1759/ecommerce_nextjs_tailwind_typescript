'use client';
import React, { useState, useEffect } from 'react';
import { Carousel } from 'flowbite-react';
import Image from 'next/image';
import { getAllSliders, Slider } from '@/model/slider';
import { motion } from 'framer-motion';
import imageBasePath from '@/components/common/path';

function Slider() {
  const [sliders, setSliders] = useState<Slider[]>([]);

  useEffect(() => {
    loadSliders();
  }, []);

  const loadSliders = async () => {
    try {
      const data = await getAllSliders();

      setSliders(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const slideInAnimation = {
    initial: { x: -100, opacity: 0 }, // Initial position and opacity
    animate: { x: 0, opacity: 1 }, // Final position and opacity
  };

  return (
    <div className="min-h-400 h-400 w-full ">
      <Carousel slideInterval={3000}>
        {sliders?.map((slider: Slider) => (
          <div className="relative ">
            <Image
              alt="..."
              src={imageBasePath + 'slider/' + slider.image_path}
              width={1960}
              height={400}
              sizes="100vw"
              objectFit=""
            />

            <div className="absolute ml-6 left-4 md:left-16 top-1/2 w-1/2 transform -translate-y-1/2 ">
              <div className="flex flex-col gap-1 md:gap-4">
                <motion.span
                  className="text-base font-semibold md:text-6xl "
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  {slider.title}
                </motion.span>
                <motion.span
                  className="text-sm md:text-2xl line-clamp-2"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  {slider.subtitle}
                </motion.span>
                <motion.button
                  type="button"
                  className="py-2 text-white w-24 md:w-44  bg-goldColor hover:bg-primaryColor"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  Shop Now
                </motion.button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Slider;
