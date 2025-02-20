import { configureStore } from '@reduxjs/toolkit';
import authSlice from './app/features/auth/authSlice';
import estateSlice from './app/features/estate/estateSlice';
import userSlice from './app/features/user/userSlice';

export const store = configureStore({
  reducer: {
    AUTH: authSlice,
    USER: userSlice,
    ESTATE: estateSlice,
  },
});

// auth
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// user
export type RootUserState = ReturnType<typeof store.getState>;
export type AppUserDispatch = typeof store.dispatch;
// user
export type RootEstateState = ReturnType<typeof store.getState>;
export type AppEstateDispatch = typeof store.dispatch;
