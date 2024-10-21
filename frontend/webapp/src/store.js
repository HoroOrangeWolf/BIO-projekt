// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import {authSlice} from "./components/features/auth/authSlice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});