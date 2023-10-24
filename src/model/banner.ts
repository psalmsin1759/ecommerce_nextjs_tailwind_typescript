import axios from '@/api/axios';

export interface Banner {
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

const BANNER_URL = '/banners';

export async function getAllBanners(): Promise<Banner[]> {
  try {
    const response = await axios.get<ApiResponse<Banner[]>>(BANNER_URL);

    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}
