'use client';
import React, { useState, useEffect } from 'react';
import { getAllBanners, Banner } from '@/model/banner';
import BannerCard from './banner_card';

function HomeBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const data = await getAllBanners();

      setBanners(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };
  return (
    <div className="md:grid md:grid-cols-2 md:gap-8 m-4">
      {banners.map((item, index) => (
        <div className="h-300 w-full mt-4" key={index}>
          <BannerCard
            title={item.title}
            imagePath={item.image_path}
            subTitle={item.subtitle}
          />
        </div>
      ))}
    </div>
  );
}

export default HomeBanner;
