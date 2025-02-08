import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../baseQuery";
import { SuccessMessage } from "@/types/responseTypes";
import { Category, CategoryFormData } from "@/types/categoryTypes";

export const categoryApiSlice = createApi({
  reducerPath: "categoryApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getAllCategories: builder.query<
      Category[],
      { search?: string; page?: number }
    >({
      query: (params) => ({
        url: "/category",
        params: {
          search: params.search,
          page: params.page,
        },
      }),
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              { type: "Category" as const, id: "LIST" }, // Cache the entire list
              ...result.map(({ id }) => ({ type: "Category" as const, id })), // Cache individual categories
            ]
          : [{ type: "Category" as const, id: "LIST" }],
    }),
    addCategory: builder.mutation<Category, CategoryFormData>({
      query: (data) => ({
        url: "/category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Category" as const, id: "LIST" }],
    }),
    deleteCategory: builder.mutation<SuccessMessage, { categoryId: string }>({
      query: (data) => ({
        url: `/category/${data.categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { categoryId }) => [
        { type: "Category" as const, id: categoryId }, // Invalidate only the deleted category
        { type: "Category" as const, id: "LIST" }, // Optionally refetch list
      ],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useAddCategoryMutation,
} = categoryApiSlice;
