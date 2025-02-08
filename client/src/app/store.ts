import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/credentials";
import { authApiSlice } from "@/features/auth/authApiSlice";
import { categoryApiSlice } from "@/features/category/categoryApiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [categoryApiSlice.reducerPath]: categoryApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(authApiSlice.middleware)
      .prepend(categoryApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
