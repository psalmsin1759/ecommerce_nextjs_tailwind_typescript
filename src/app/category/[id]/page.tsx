'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/product_card';
import { BsGrid3X3GapFill } from 'react-icons/bs';
import { FaListUl } from 'react-icons/fa';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import ProductListCard from '@/components/product/product_list_card';
import { FaFilter, FaTrash } from 'react-icons/fa';
import { Button, Modal } from 'flowbite-react';
import MultiRangeSlider, { ChangeResult } from 'multi-range-slider-react';

import { getProductsByCategory, Product } from '@/model/Product';

import { ProductVariant, getAllProductVariants } from '@/model/product_variant';

function CategoryMainPage({ params }: { params: { id: number } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState('Category');
  const [selectedSortType, setSelectedSortType] = useState<string>('Default'); // Default sort type

  useEffect(() => {
    loadProducts();
    getsetProductVariantsData();
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

  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);

  const getsetProductVariantsData = async () => {
    const data = await getAllProductVariants();
    setProductVariants(data);
  };

  const groupVariantsByOption = () => {
    const uniqueOptions = new Set<string>();
    const groupedVariants: { [key: string]: ProductVariant[] } = {};

    productVariants.forEach((variant: ProductVariant) => {
      // Check if the option-value pair is unique
      const optionName = `${variant.option}-${variant.value}`;
      if (!uniqueOptions.has(optionName)) {
        uniqueOptions.add(optionName);

        // Create a group for the option if it doesn't exist
        if (!groupedVariants[variant.option]) {
          groupedVariants[variant.option] = [];
        }

        // Add the variant to the group
        groupedVariants[variant.option].push(variant);
      }
    });

    return groupedVariants;
  };

  const [viewMode, setViewMode] = useState('grid'); // Default view mode is grid

  const toggleView = (mode: string) => {
    setViewMode(mode);
  };

  const [openModal, setOpenModal] = useState(false);

  const [checkedVariants, setCheckedVariants] = useState<Set<string>>(
    new Set()
  );

  const [sliderMinValue, setSliderMinValue] = useState(0);
  const [sliderMaxValue, setSliderMaxValue] = useState(1000);

  const handleCheckboxChange = (option: string, value: string) => {
    const variantKey = `${option}-${value}`;
    const newCheckedVariants = new Set(checkedVariants);

    if (checkedVariants.has(variantKey)) {
      newCheckedVariants.delete(variantKey);
    } else {
      newCheckedVariants.add(variantKey);
    }

    setCheckedVariants(newCheckedVariants);
  };

  const handleApplyFilter = () => {
    console.log('Selected Variants:', Array.from(checkedVariants));
    console.log('Slider Values:', sliderMinValue, sliderMaxValue);

    const selectedVariants = Array.from(checkedVariants);

    // Check if any variant checkbox is checked
    const isAnyVariantChecked = selectedVariants.length > 0;

    // Get the selected products based on the checked variants and price range
    const selectedProducts = products.filter((product) => {
      // Check if any variant checkbox is checked
      const hasSelectedVariants =
        isAnyVariantChecked &&
        product.variants.some((variant) =>
          selectedVariants.includes(`${variant.option}-${variant.value}`)
        );

      // Check if the product's price is within the selected slider range
      const isPriceInSliderRange =
        product.price >= sliderMinValue && product.price <= sliderMaxValue;

      // If no variant checkbox is checked, only filter by price
      if (!isAnyVariantChecked) {
        return isPriceInSliderRange;
      }

      // Return true if the product meets both criteria
      return hasSelectedVariants && isPriceInSliderRange;
    });

    setProducts(selectedProducts);
    // Clear checked variants
    setCheckedVariants(new Set());

    // Add further logic to apply the filter
    setOpenModal(false);
  };

  const clearFilter = async () => {
    await loadProducts();
    setOpenModal(false);
  };

  const handleSortTypeChange = (selectedSortType: string) => {
    setSelectedSortType(selectedSortType);

    // Sort the products immediately when the sort type changes
    const sortedProducts = sortProducts(products, selectedSortType);
    setProducts(sortedProducts);
  };

  const sortProducts = (products: Product[], sortType: string): Product[] => {
    switch (sortType) {
      case 'NameAZ':
        return [...products].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
      case 'NameZA':
        return [...products].sort((a, b) =>
          b.name.localeCompare(a.name, undefined, { sensitivity: 'base' })
        );
      case 'PriceLowHigh':
        return [...products].sort((a, b) => a.price - b.price);
      case 'PriceHighLow':
        return [...products].sort((a, b) => b.price - a.price);
      default:
        return products; // Default: no sorting
    }
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
      <div className="min-h-screen  m-4  ">
        <div className="w-full flex flex-col">
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

            <div className="flex flex-row gap-2">
              <div
                className=" flex flex-row items-center gap-2 bg-primaryColor px-4 py-2 text-black hover:text-white hover:bg-goldColor cursor-pointer"
                onClick={() => setOpenModal(true)}
              >
                <FaFilter />
                <span>Filter</span>
              </div>
              <select
                className="pr-16 border rounded w-48 text-sm focus:border-primaryColor"
                id="sort"
                name="sort"
                value={selectedSortType}
                onChange={(e) => handleSortTypeChange(e.target.value)}
              >
                <option value="Default">Default</option>
                <option value="NameAZ">Name (A - Z)</option>
                <option value="NameZA">Name (Z - A)</option>
                <option value="PriceLowHigh">Price (Low to High)</option>
                <option value="PriceHighLow">Price (High to Low)</option>
              </select>
              <Modal
                dismissible
                show={openModal}
                onClose={() => setOpenModal(false)}
              >
                <Modal.Header>Filter Products</Modal.Header>
                <Modal.Body>
                  <div className="space-y-6 ">
                    <div className="w-full flex flex-col">
                      <div className="w-full flex justify-end">
                        <div
                          className=" flex flex-row items-center gap-2 bg-black text-white hover:bg-primaryColor py-2 px-4 rounded cursor-pointer"
                          onClick={clearFilter}
                        >
                          <FaTrash /> Clear Filter
                        </div>
                      </div>
                      <span className="text-lg font-semibold">
                        Filter By Price
                      </span>
                      <MultiRangeSlider
                        style={{
                          border: 'none',
                          boxShadow: 'none',
                          padding: '15px 10px',
                        }}
                        ruler={false}
                        min={0}
                        max={1000}
                        step={5}
                        label={false}
                        minValue={sliderMinValue}
                        maxValue={sliderMaxValue}
                        onInput={(e: ChangeResult) => {
                          setSliderMinValue(e.minValue);
                          setSliderMaxValue(e.maxValue);
                        }}
                      ></MultiRangeSlider>
                      <div className="flex flex-row justify-between">
                        <div>${sliderMinValue}</div>
                        <div>${sliderMaxValue}</div>
                      </div>

                      {Object.entries(groupVariantsByOption()).map(
                        ([option, variants], index) => (
                          <div
                            className="mt-2 flex flex-col  w-full"
                            key={`${option}-${variants
                              .map((variant) => variant.id)
                              .join('-')}`}
                          >
                            <div className="mt-2">
                              <span className="text-lg font-semibold">
                                Filter By {option}
                              </span>
                            </div>

                            <div className="mt-2 flex flex-col">
                              {variants.map(
                                (variant: ProductVariant, index) => (
                                  <label key={index}>
                                    <input
                                      className="mr-2"
                                      type="checkbox"
                                      value={variant.value}
                                      onChange={() =>
                                        handleCheckboxChange(
                                          option,
                                          variant.value
                                        )
                                      }
                                    />
                                    {variant.value}
                                  </label>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className="bg-primaryColor text-white hover:bg-black py-2 px-4 rounded"
                    onClick={handleApplyFilter}
                  >
                    Apply
                  </button>
                  <Button color="gray" onClick={() => setOpenModal(false)}>
                    Cancel
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>

          <div
            className={`mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ${
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
    </div>
  );
}

export default CategoryMainPage;
