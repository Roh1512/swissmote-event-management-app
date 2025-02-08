import AddCategory from "@/components/CategoryComponents/AddCategory";
import Category from "@/components/CategoryComponents/Category";
import AlertText from "@/components/ErrorComponents/AlertText";
import PageLoading from "@/components/Loading/PageLoading";
import { useGetAllCategoriesQuery } from "@/features/category/categoryApiSlice";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search");

  const updateParams = useCallback(
    (newParams: { page?: string; search?: string }) => {
      const updatedParams = new URLSearchParams(searchParams);
      if (newParams.page) updatedParams.set("page", newParams.page);
      if (newParams.search) updatedParams.set("search", newParams.search);
      setSearchParams(updatedParams);
    },
    [searchParams, setSearchParams]
  );

  const [searchQuery, setSearchQuery] = useState<string | null>(search || "");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery || "");
    });
    return () => {
      clearTimeout(handler); // Clear timeout if searchQuery changes before delay is complete
    };
  }, [searchQuery]);

  const { data: categories, isLoading } = useGetAllCategoriesQuery({
    page: page,
    search: debouncedSearch || "",
  });

  const handleNextPage = useCallback(() => {
    if (categories && Array.isArray(categories) && categories.length < 19) {
      updateParams({ page: (page + 1).toString() });
    }
  }, [categories, page, updateParams]);

  console.log(categories);

  const handlePreviousPage = useCallback(() => {
    // Ensure page doesn't go below 1
    if (page !== 1) {
      updateParams({ page: (page - 1).toString() });
    }
    return;
  }, [page, updateParams]);

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div
      className="p-6 bg-base-100 flex flex-col items-center justify-between gap-4"
      style={{ minHeight: "100vh" }}
    >
      <div>
        <h3>Categories</h3>
        <AddCategory />
        <br />
        <div className="flex items-center justify-center">
          <label className="input input-bordered flex items-center">
            <input
              type="text"
              className="grow"
              placeholder="Search categories"
              aria-label="Search categories"
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-6 h-6" />
          </label>
        </div>
      </div>

      <br />

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-7 lg:grid-cols-3 flex-1">
        {categories ? (
          Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category) => (
              <Category key={category.id} category={category} />
            ))
          ) : (
            <AlertText text="NO CATEGORIES TO SHOW" />
          )
        ) : (
          <AlertText text="NO CATEGORIES TO SHOW" />
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="btn btn-sm btn-ghost"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="flex items-center px-4 py-2 bg-base-200 rounded-lg">
          Page {page}
        </span>
        <button
          onClick={handleNextPage}
          disabled={
            categories &&
            Array.isArray(categories) &&
            (categories.length === 0 || categories.length < 15)
          } // Disable if fewer items are returned than the limit
          className="btn btn-sm btn-ghost"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Categories;
