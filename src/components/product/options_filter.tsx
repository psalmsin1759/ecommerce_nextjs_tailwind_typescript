import React, { useState, useEffect } from 'react';
import axios from '@/api/axios';

type Filters = {
  [key: string]: string[];
};

function OptionsFilter() {
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    loadFilters();
  }, []);

  
  const URL = `/getStoreProductOptions/18`;

  const loadFilters = async () => {
    try {
      const response = await axios.get(URL);
      const filterData = response?.data.data;

      if (filterData) {
        setFilters(filterData);
      } else {
        console.error('Data is empty:', response?.data.data);
      }
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };
  return (
    <div className="w-full">
      <div className=" text-black bg-gray-100 pl-6 pr-6 pt-2 pb-2 border-gray-200 mt-4 border">
        <span>Options</span>
      </div>
      {Object.keys(filters).map((option, index) => (
        <div
          key={index}
          className="text-black pl-6 pr-6 pt-2 pb-2 border-gray-200 border"
        >
          <span className="mb-2">{option}</span>
          <ul>
            {filters[option].map((value, valueIndex) => (
              <li key={valueIndex}>
                <label>
                  <input type="checkbox" value={value} className="mr-4" />
                  <span>{value}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default OptionsFilter;
