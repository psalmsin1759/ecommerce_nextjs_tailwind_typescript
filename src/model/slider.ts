import axios from '@/api/axios';

export interface Slider {
  id: number;
  title: string;
  subtitle: string;
  sort_order: number;
  image_path: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const CATEGORY_URL = '/sliders';

export async function getAllSliders(): Promise<Slider[]> {
  try {
    const response = await axios.get<ApiResponse<Slider[]>>(CATEGORY_URL);

    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}
