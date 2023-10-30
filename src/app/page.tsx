'use client';
import Footer from '@/components/common/footer';
import Slider from '@/components/slider/slider';
import HomeBanner from '@/components/banner/home_banner';
import FeaturedProducts from '@/components/featured/featured';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/*       <ScrollToTop smooth color="#6f00ff" className="bg-primaryColor" /> */}
      <Slider />
      <HomeBanner />
      <FeaturedProducts />
      <Footer />
    </main>
  );
}
