import axios from '@/api/axios';
import { Order } from './order';

export interface OrderProduct {
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
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  item: T;
}

const ORDER_URL = '/getOrderItemFromID';

export async function getOrderItems(orderID: number): Promise<OrderProduct[]> {
  try {
    const response = await axios.get<ApiResponse<OrderProduct[]>>(
      `${ORDER_URL}/${orderID}`
    );

    return response.data.item;
  } catch (error) {
    throw new Error('Failed to fetch orders');
  }
}

export interface ApiOrderResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const ORDER_BY_ID_URL = '/getOrdersByOrderID';

export async function getOrderByID(orderID: number): Promise<Order> {
  try {
    const response = await axios.get<ApiOrderResponse<Order>>(
      `${ORDER_BY_ID_URL}/${orderID}`
    );

    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch orders');
  }
}
