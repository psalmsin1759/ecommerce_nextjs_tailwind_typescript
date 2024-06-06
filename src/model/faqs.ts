import axios from '@/api/axios';

export interface FAQs {
  id: number;
  question: string;
  answer: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const URL = '/faqs';

export async function getFaqs(): Promise<FAQs[]> {
  try {
    const response = await axios.get<ApiResponse<FAQs[]>>(`${URL}`);

    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch');
  }
}
