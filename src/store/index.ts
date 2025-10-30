import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import reportsReducer from './slices/reportsSlice';
import diseasesReducer from './slices/diseasesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportsReducer,
    diseases: diseasesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
