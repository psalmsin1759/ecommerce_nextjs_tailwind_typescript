import axios from '@/api/axios';

export interface Coupon {
  id: number;
  code: string;
  type: string;
  value: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const URL = '/applyCoupon';

export async function applyCoupon(couponCode: string): Promise<Coupon> {
  try {
    const response = await axios.get<ApiResponse<Coupon>>(
      `${URL}/${couponCode}`
    );
    console.log(response.data.data);
    return response.data.data; // Access the "data" property in the response
  } catch (error) {
    throw new Error(`Failed to fetch coupon with code ${couponCode}`);
  }
}
