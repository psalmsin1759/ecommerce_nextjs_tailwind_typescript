'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/product_card';
import Footer from '@/components/common/footer';
import SideCategory from '@/components/category/side_category';
import PriceFilter from '@/components/product/price_filter';
import OptionsFilter from '@/components/product/options_filter';
import { BsGrid3X3GapFill } from 'react-icons/bs';
import { FaListUl } from 'react-icons/fa';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import ProductListCard from '@/components/product/product_list_card';

import { getProductsByCategory, Product } from '@/model/Product';

import { useDispatch, useSelector } from 'react-redux';
import {
  FilterState,
  setPriceRange,
  setSortType,
} from '@/redux/filter/filterSlice';

function CategoryMainPage({ params }: { params: { id: number } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState('Category');

  const dispatch = useDispatch();
  const filter = useSelector((state: FilterState) => state);
  const handlePriceRangeChange = (selectedPriceRange: string) => {
    dispatch(setPriceRange(selectedPriceRange));
  };

  const handleSortTypeChange = (selectedSortType: string) => {
    dispatch(setSortType(selectedSortType));
  };

  // Function to handle filter and sort changes
  const handleFilterChange = (
    selectedPriceRange: string,
    selectedSortType: string
  ) => {
    // Dispatch the selected price range and sort type
    dispatch(setPriceRange(selectedPriceRange));
    dispatch(setSortType(selectedSortType));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { category, products } = await getProductsByCategory(params.id);

      setCategoryName(category);
      setProducts(products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const [viewMode, setViewMode] = useState('grid'); // Default view mode is grid

  const toggleView = (mode: string) => {
    setViewMode(mode);
  };

  return (
    <div className="mt-4 min-h-60">
      <div className=" bg-gray-100  p-5 items-center ">
        {/*  <span className="text-white">Home \ {categoryName}</span> */}
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="#" icon={HiHome}>
            <p>Home</p>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">Category</Breadcrumb.Item>
          <Breadcrumb.Item>{categoryName}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="min-h-screen flex flex-col-reverse md:flex-row m-4  ">
        <div className="basis-1/5 md:mr-2">
          <SideCategory />
          <div className="flex flex-col mt-2">
            <div className="flex flex-row justify-between">
              <span className="text-lg font-semibold">Filter</span>
              <button
                type="button"
                className="bg-primaryColor px-2 py-1 text-sm text-white hover:bg-black"
              >
                Clear all
              </button>
            </div>
          </div>
          {/* <PriceFilter />
          <OptionsFilter /> */}
        </div>

        <div className="basis-4/5 flex flex-col">
          <div className=" border p-2 flex justify-between items-center">
            <div className="flex flex-row gap-2">
              <BsGrid3X3GapFill
                onClick={() => toggleView('grid')}
                className="cursor-pointer hover:text-primaryColor"
              />{' '}
              <FaListUl
                onClick={() => toggleView('list')}
                className="cursor-pointer hover:text-primaryColor"
              />
            </div>

            <select
              className="pr-16 border rounded w-48 text-sm focus:border-primaryColor"
              id="sort"
              name="sort"
              value={filter.sortType}
              onChange={(e) => handleSortTypeChange(e.target.value)}
            >
              <option value="Default">Default</option>
              <option value="Default">Name (A - Z)</option>
              <option value="Default">Name (Z - A)</option>
              <option value="Default">Price (Low &gt; High)</option>
              <option value="Default">Price (Hight &lt; Low)</option>
            </select>
          </div>

          <div
            className={`mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 ${
              viewMode === 'list' ? 'hidden' : ''
            }`}
          >
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div
            className={`grid-col-1 gap-2 ${
              viewMode === 'grid' ? 'hidden' : ''
            }`}
          >
            {products?.map((product) => (
              <ProductListCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CategoryMainPage;
