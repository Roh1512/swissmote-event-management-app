import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/credentials";
import { authApiSlice } from "@/features/auth/authApiSlice";
import { categoryApiSlice } from "@/features/category/categoryApiSlice";
import { eventApiSlice } from "@/features/events/eventApiSlice";
import { myEventsApiSlice } from "@/features/events/myEventsApiSlice";
import { profileApiSlice } from "@/features/profile/profileApiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [categoryApiSlice.reducerPath]: categoryApiSlice.reducer,
    [eventApiSlice.reducerPath]: eventApiSlice.reducer,
    [myEventsApiSlice.reducerPath]: myEventsApiSlice.reducer,
    [profileApiSlice.reducerPath]: profileApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(categoryApiSlice.middleware)
      .concat(eventApiSlice.middleware)
      .concat(myEventsApiSlice.middleware)
      .concat(profileApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
