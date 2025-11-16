import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import reportsReducer from './slices/reportsSlice';
import diseasesReducer from './slices/diseasesSlice';
import adminReducer from './slices/adminSlice';
import newsReducer from './slices/newsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportsReducer,
    diseases: diseasesReducer,
    admin: adminReducer,
    news: newsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
