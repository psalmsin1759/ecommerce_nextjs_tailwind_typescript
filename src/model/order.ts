import axios from '@/api/axios';

export interface Order {
  id: number;
  orderid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  payment_method: string;
  total_price: number;
  tax: number;
  status: string;
  discount: number;
  shipping_address: number;
  shipping_city: string;
  shipping_postalCode: string;
  shipping_state: string;
  shipping_country: string;
  created_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const ORDER_URL = '/getOrdersByCustomer';

export async function getOrders(customerID: number): Promise<Order[]> {
  try {
    const response = await axios.get<ApiResponse<Order[]>>(
      `${ORDER_URL}/${customerID}`
    );

    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch orders');
  }
}
