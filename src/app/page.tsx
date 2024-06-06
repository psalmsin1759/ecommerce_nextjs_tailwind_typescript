'use client';
import Slider from '@/components/slider/slider';
import HomeBanner from '@/components/banner/home_banner';
import FeaturedProducts from '@/components/featured/featured';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col rounded-none">
      {/*       <ScrollToTop smooth color="#6f00ff" className="bg-primaryColor" /> */}
      <div className=" min-h-screen flex flex-col">
        <Slider />
        <HomeBanner />
        <FeaturedProducts />
      </div>
    </main>
  );
}
