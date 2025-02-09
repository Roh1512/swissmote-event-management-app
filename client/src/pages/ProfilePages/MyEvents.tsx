import AlertText from "@/components/ErrorComponents/AlertText";
import PageLoading from "@/components/Loading/PageLoading";
import { useGetMyEventsQuery } from "@/features/events/myEventsApiSlice";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AddEventComponent from "../EventPages/AddEvent";
import MyEvent from "@/components/EventComponents/MyEvent";

const MyEvents = () => {
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

  const { data: events, isLoading } = useGetMyEventsQuery({
    page: page,
    search: debouncedSearch || "",
  });

  const handleNextPage = useCallback(() => {
    updateParams({ page: (page + 1).toString() });
  }, [page, updateParams]);

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
      <h3>All Events</h3>
      <AddEventComponent />
      <br />
      <div className="flex items-center justify-center">
        <label className="input input-bordered flex items-center">
          <input
            type="text"
            className="grow"
            placeholder="Search Events"
            aria-label="Search Events"
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="w-6 h-6" />
        </label>
      </div>

      <br />

      <div className="flex gap-4 flex-col w-full">
        {events ? (
          Array.isArray(events) && events.length > 0 ? (
            events.map((event) => <MyEvent key={event.id} event={event} />)
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
            events &&
            Array.isArray(events) &&
            (events.length === 0 || events.length < 15)
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

export default MyEvents;
