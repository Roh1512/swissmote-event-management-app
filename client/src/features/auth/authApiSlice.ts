import { createApi } from "@reduxjs/toolkit/query/react";
import { setCredentials, clearCredentials } from "./credentials";
import { baseQueryWithReAuth } from "../baseQuery";
import { AccessToken, LoginRequest, RegisterRequest } from "@/types/authTypes";
import { SuccessMessage } from "@/types/responseTypes";

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Session"],
  endpoints: (builder) => ({
    register: builder.mutation<AccessToken, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Session" }],
    }),
    login: builder.mutation<AccessToken, LoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Session" }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const response: AccessToken = (await queryFulfilled).data;
          dispatch(setCredentials({ accessToken: response.accessToken }));
        } catch (error) {
          console.error("Error logging in: ", error);
        }
      },
    }),
    checkAuth: builder.query<SuccessMessage, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      providesTags: [{ type: "Session" }],
    }),
    logout: builder.mutation<SuccessMessage, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Session" }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearCredentials());
        } catch (error) {
          console.error("Logout failed", error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useCheckAuthQuery,
} = authApiSlice;
