import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice.jsx';

export const userStore = configureStore({
  reducer: {
    user: userReducer,
  },
});