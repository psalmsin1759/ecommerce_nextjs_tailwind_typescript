import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart/cartSlice';
import filterSlice from './filter/filterSlice';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Choose a storage medium

const persistConfig = {
  key: 'root',
  storage, // Use the chosen storage medium
};

const persistedReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    filter: filterSlice,
  },
});

export const persistor = persistStore(store);
export default store;
export type RootState = ReturnType<typeof store.getState>;
