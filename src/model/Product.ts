import axios from '@/api/axios';

export interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  in_stock: number;
  description: string;
  price: number;
  discounted_price: number;
  sort_order: number;
  status: string;
  featured: number;
  new_arrival: number;
  created_at: string;
  updated_at: string;
  images: Image[];
  variants: Variant[];
  relatedproducts: RelatedProduct[];
  /* option: string; */
}

export interface Image {
  id: number;
  path: string;
  product_id: number;
  created_at: string;
  updated_at: string;
}

export interface Variant {
  id: number;
  option: string;
  value: string;
  quantity: number;
  product_id: number;
  created_at: string;
  updated_at: string;
}

export interface RelatedProduct {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  description: string;
  price: number;
  discounted_price: number;
  new_arrival: number;
  product_id: number;
  images: Image[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const FEATURED_PRODUCTS_URL = '/getfeaturedproduct';

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await axios.get<ApiResponse<Product[]>>(
      FEATURED_PRODUCTS_URL
    );

    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}

const ALL_PRODUCTS_URL = '/products';

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await axios.get<ApiResponse<Product[]>>(ALL_PRODUCTS_URL);

    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}

const PRODUCT_BY_ID_URL = '/products';

export async function getProductByID(productID: number): Promise<Product> {
  try {
    const response = await axios.get<ApiResponse<Product>>(
      `${PRODUCT_BY_ID_URL}/${productID}`
    );
    console.log(response.data.data);
    return response.data.data; // Access the "data" property in the response
  } catch (error) {
    throw new Error(`Failed to fetch product with ID ${productID}`);
  }
}

interface ProductCategoryResponse<T> {
  success: boolean;
  message: string;
  category: string;
  //filteroption: T;
  data: T;
}

interface CategoryWithProducts {
  category: string;
  products: Product[];
}

const PRODUCT_BY_CATEGORY = '/productcategory';

export async function getProductsByCategory(
  categoryID: number
): Promise<CategoryWithProducts> {
  try {
    const response = await axios.get<ProductCategoryResponse<Product[]>>(
      `${PRODUCT_BY_CATEGORY}/${categoryID}`
    );
    return {
      category: response.data.category,
      products: response.data.data,
    };
  } catch (error) {
    throw new Error('Failed to fetch products by category');
  }
}

const RELATED_PRODUCTS_URL = '/getRelatedProducts/18';

export async function getRelatedProducts(
  productID: number
): Promise<Product[]> {
  try {
    const response = await axios.get<ApiResponse<Product[]>>(
      `${RELATED_PRODUCTS_URL}/${productID}`
    );

    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}
