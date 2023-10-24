import axios from '@/api/axios';

export interface Country {
  name: string;
  code: string;
}

const JSON = '/json/country.json';

export async function getCountries(): Promise<Country[]> {
  try {
    const response = await axios.get<Country[]>(JSON);

    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}
