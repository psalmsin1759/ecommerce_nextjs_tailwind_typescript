'use client';
import React, { useState, useEffect } from 'react';
import { getFeaturedProducts, Product } from '@/model/Product';
import ProductCard from '@/components/product/product_card';

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productsData = await getFeaturedProducts();

      setProducts(productsData);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center mt-6">
      <h1 className="text-4xl">Featured Products</h1>
      <div className="m-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {products?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default FeaturedProducts;
