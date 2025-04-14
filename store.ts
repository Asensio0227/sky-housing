import { configureStore } from '@reduxjs/toolkit';
import authSlice from './app/features/auth/authSlice';
import chatsSlice from './app/features/chats/chatsSlice';
import estateSlice from './app/features/estate/estateSlice';
import reviewsSlice from './app/features/reviews/reviewsSlice';
import userSlice from './app/features/user/userSlice';

export const store = configureStore({
  reducer: {
    AUTH: authSlice,
    USER: userSlice,
    ESTATE: estateSlice,
    Reviews: reviewsSlice,
    Chats: chatsSlice,
  },
});

// auth
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// user
export type RootUserState = ReturnType<typeof store.getState>;
export type AppUserDispatch = typeof store.dispatch;
// estate
export type RootEstateState = ReturnType<typeof store.getState>;
export type AppEstateDispatch = typeof store.dispatch;
// review
export type RootReviewsState = ReturnType<typeof store.getState>;
export type AppReviewsDispatch = typeof store.dispatch;
// chats
export type RootChatsState = ReturnType<typeof store.getState>;
export type AppChatsDispatch = typeof store.dispatch;
