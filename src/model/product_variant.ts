import axios from '@/api/axios';

export interface ProductVariant {
  id: number;
  option: string;
  value: string;
  quantity: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const URL = '/getAllProductVariants';

export async function getAllProductVariants(): Promise<ProductVariant[]> {
  try {
    const response = await axios.get<ApiResponse<ProductVariant[]>>(`${URL}`);

    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch');
  }
}
