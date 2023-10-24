import axios from '@/api/axios';

export interface Category {
  id: number;
  name: string;
  sort_order: number;
  image: string;
  parent_id: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const CATEGORY_URL = '/categories';

export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await axios.get<ApiResponse<Category[]>>(CATEGORY_URL);

    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}
