import axios from '@/api/axios';

export interface Store {
  id: number;
  name: string;
  address: string;
  state: string;
  country: string;
  geocode_latitude: string;
  geocode_longitude: string;
  email: string;
  phone: string;
  opening_times: string;
  aboutus: string;
  mission: string | null;
  vision: string | null;
  terms: string;
  privacy_policy: string;
  return_policy: string;
  refund_policy: string;
  favicon_path: string | null;
  logo_path: string | null;
  footer_logo_path: string | null;
  meta_title: string;
  meta_description: string;
  meta_tag_keywords: string;
  instagram_link: string;
  facebook_link: string;
  twitter_link: string;
  tiktok_link: string | null;
  payment_pub_key: string;
  payment_secret_key: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const STORE_URL = '/store';

export async function getStoreData(): Promise<Store> {
  try {
    const response = await axios.get<ApiResponse<Store>>(STORE_URL);

    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch store data');
  }
}
