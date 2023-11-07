import axios from '@/api/axios';
import qs from 'qs';

export interface WishlistProduct {
  id: number;
  quantity: number;
  options: any | null;
  order_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  qty: number;
  name: string;
  sku: string;
  in_stock: number;
  featured: number;
  new_arrival: number;
  sort_order: number;
  description: string;
  price: number;
  discounted_price: number;
  cost_price: number;
  status: string;
  image_path: string;
  wishlistid: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const URL = '/wishlists';

export async function getWishlist(
  customerID: number
): Promise<WishlistProduct[]> {
  try {
    const response = await axios.get<ApiResponse<WishlistProduct[]>>(
      `${URL}/${customerID}`
    );

    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch orders');
  }
}

export async function addToWishList(customerID: number, productID: number) {
  try {
    const input = {
      product_id: productID,
      customer_id: customerID,
    };
    const response = await axios.post(URL, qs.stringify(input), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch');
  }
}

export async function deleteWishlist(id: number) {
  try {
    const response = await axios.delete(`${URL}/${id}`);

    return response.data.success;
  } catch (error) {
    throw new Error('Failed');
  }
}
