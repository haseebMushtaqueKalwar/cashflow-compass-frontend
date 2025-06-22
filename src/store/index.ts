
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import productsSlice from './slices/productsSlice';
import invoicesSlice from './slices/invoicesSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productsSlice,
    invoices: invoicesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
