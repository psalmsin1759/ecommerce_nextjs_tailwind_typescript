import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the TypeScript type for the filter state
export interface FilterState {
  priceRange: string; // 'all' or other ranges you want to support
  sortType: string; // 'none', 'a - z', 'z - a', 'low - high', 'hight - low'
}

const initialState: FilterState = {
  priceRange: 'all',
  sortType: 'none',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPriceRange: (state, action: PayloadAction<string>) => {
      state.priceRange = action.payload;
    },
    setSortType: (state, action: PayloadAction<string>) => {
      state.sortType = action.payload;
    },
  },
});

export const { setPriceRange, setSortType } = filterSlice.actions;
export default filterSlice.reducer;
