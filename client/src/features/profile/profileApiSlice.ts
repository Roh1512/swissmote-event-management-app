import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../baseQuery";
import { User } from "@/types/userTypes";

export const profileApiSlice = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      providesTags: [{ type: "Profile" }],
    }),
  }),
});

export const { useGetProfileQuery } = profileApiSlice;
