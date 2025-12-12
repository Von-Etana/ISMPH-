import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import reportsReducer from './slices/reportsSlice';
import diseasesReducer from './slices/diseasesSlice';
import adminReducer from './slices/adminSlice';
import newsReducer from './slices/newsSlice';
import feedbackReducer from './slices/feedbackSlice';
import notificationsReducer from './slices/notificationsSlice';
import facilitiesReducer from './slices/facilitiesSlice';
import policyReducer from './slices/policySlice';
import categoriesReducer from './slices/categoriesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportsReducer,
    diseases: diseasesReducer,
    admin: adminReducer,
    news: newsReducer,
    feedback: feedbackReducer,
    notifications: notificationsReducer,
    facilities: facilitiesReducer,
    policy: policyReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
