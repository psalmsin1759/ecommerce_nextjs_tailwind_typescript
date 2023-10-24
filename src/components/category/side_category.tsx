'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from '@/api/axios';
import { Category, getAllCategories } from '@/model/category';

function SideCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const CategorysData = await getAllCategories();

      const allCategories = CategorysData;
      const mainCategories = allCategories.filter(
        (category) => category.parent_id === 0
      );
      setCategories(mainCategories);
      setSubcategories(
        allCategories.filter((category) => category.parent_id !== 0)
      );
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (categoryId: any) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null); // Collapse subcategories
    } else {
      setActiveCategory(categoryId); // Expand subcategories
    }
  };

  return (
    <div className="w-full">
      <div className=" text-black bg-gray-100 pl-6 pr-6 pt-2 pb-2 border-gray-200  border">
        <span>Category</span>
      </div>

      {categories.map((category) => (
        <div
          key={category.id}
          className="categorybar flex flex-col  cursor-pointer"
          onClick={handleCategoryClick.bind(null, category.id)}
        >
          <div className="flex items-center justify-between">
            <span className="category-name">{category.name}</span>
            {subcategories.some(
              (subcategory) => subcategory.parent_id === category.id
            ) && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 ${
                  activeCategory === category.id ? 'transform rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div>

          <div
            className={`${
              activeCategory === category.id ? 'block' : 'hidden'
            }  w-full bg-white border border-gray-300 rounded-lg mt-2 `}
          >
            {subcategories
              .filter((subcategory) => subcategory.parent_id === category.id)
              .map((subcategory) => (
                <div
                  key={subcategory.id}
                  className="subcategorybar px-4 py-2 cursor-pointer"
                >
                  <span>{subcategory.name}</span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SideCategory;
