import axios from '@/api/axios';

export interface DeliveryMethod {
  id: number;
  name: string;
  description: string;
  amount: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  default: number;
  data: T;
}

const URL = '/getDeliveryMethods';

export async function deliveryMethodAPI(): Promise<{
  default: DeliveryMethod;
  data: DeliveryMethod[];
}> {
  try {
    const response = await axios.get<ApiResponse<DeliveryMethod[]>>(URL);
    if (response.data.success) {
      const defaultMethod = response.data.default
        ? response.data.data.find(
            (method) => method.id === response.data.default
          )
        : null;

      return {
        default: defaultMethod!,
        data: response.data.data,
      };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw new Error('Failed to fetch');
  }
}
