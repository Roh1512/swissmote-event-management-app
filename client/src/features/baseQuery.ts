import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import { setCredentials, clearCredentials } from "./auth/credentials";

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    console.log("TOKEN: ", token);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQueryWithAuth(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    try {
      const refreshResult = await baseQueryWithAuth(
        {
          url: "/auth/refresh",
          method: "POST",
          credentials: "include",
        },
        api,
        extraOptions
      );
      console.log(refreshResult);

      if (refreshResult.data) {
        console.log("REFRESH TOKEN: ", refreshResult.data);
        api.dispatch(
          setCredentials({
            accessToken: (refreshResult.data as { accessToken: string })
              .accessToken,
          })
        );
        // Retry the original query with new token
        result = await baseQueryWithAuth(args, api, extraOptions);
      } else {
        api.dispatch(clearCredentials());
      }
    } catch (error) {
      console.log("Error refreshing token: ", error);
      api.dispatch(clearCredentials());
    }
  }
  return result;
};
