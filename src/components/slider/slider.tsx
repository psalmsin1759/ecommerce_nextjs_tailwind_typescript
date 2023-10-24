'use client';
import React, { useState, useEffect } from 'react';
import { Carousel } from 'flowbite-react';
import Image from 'next/image';
import { getAllSliders, Slider } from '@/model/slider';

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
  return (
    <div className="h-200 w-full ">
      <Carousel>
        {/*  <div className="carousel">
          <Image
            alt="..."
            src="https://via.placeholder.com/600x200.png"
            width={1200}
            height={200}
            layout="responsive"
            className="relative"
          />
          <div className="absolute top-0 left-0 right-0 p-4 bg-black bg-opacity-40">
            <h3 className="text-2xl text-white">Title 1</h3>
            <p className="text-lg text-gray-300">Subtitle 1</p>
            <a
              href="#button-link"
              className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Button Text
            </a>
          </div>
        </div> */}

        {sliders?.map((slider: Slider) => (
          <div className="w-full  relative">
            <Image
              alt="..."
              src={slider.image_path}
              width={1960}
              height={400}
              sizes="100vw"
              objectFit=""
            />

            {/* <div className="absolute top-10 left-8 w-1/2">
              <span className="text-xl  text-black-500 break-words block">
                {slider.title}
              </span>
              <span className="text-2xl font-semibold text-black-500 break-words block mt-2">
                {slider.subtitle}
              </span>

              <button type="button" className="primaryColorButton">
                Shop Now
              </button>
            </div> */}
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Slider;
