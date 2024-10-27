// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './components/features/auth/authSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});
