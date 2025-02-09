import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../baseQuery";
import { SuccessMessage } from "@/types/responseTypes";
import { EventData } from "@/types/eventTypes";
import { io } from "socket.io-client";
import { serverURL } from "@/utils.ts/socketUtils";

export const eventApiSlice = createApi({
  reducerPath: "eventApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    getAllEvents: builder.query<
      EventData[],
      {
        search?: string;
        page?: number;
      }
    >({
      query: (params) => ({
        url: "/event",
        params: {
          search: params.search,
          page: params.page,
        },
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // Create your Socket.IO connection. Adjust the URL/path as needed.
        const socket = io(serverURL, {
          withCredentials: true,
          autoConnect: true,
        });

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id); // Now connected
        });

        console.log("SOCKET: ", socket.connected);

        try {
          // Wait until the initial query has resolved before subscribing
          await cacheDataLoaded;

          // Listen for "eventCreated" messages from the server
          socket.on("eventCreated", (newEvent: EventData) => {
            // Update the cached data to include the new event
            updateCachedData((draft) => {
              // Insert newEvent at the beginning or anywhere as needed
              draft.unshift(newEvent);
            });
          });

          // Optionally, listen for other events (like "userAttending") and update accordingly:
          socket.on("userAttending", ({ eventId, userId }) => {
            updateCachedData((draft) => {
              const eventToUpdate = draft.find((event) => event.id === eventId);
              if (eventToUpdate) {
                // For example, assuming eventToUpdate.attendees is an array of user IDs:
                if (!eventToUpdate.attendees.includes(userId)) {
                  eventToUpdate.attendees.push(userId);
                }
              }
            });
          });
          socket.on("eventDeleted", ({ eventId }) => {
            updateCachedData((draft) => {
              // Remove the event with the matching eventId.
              const index = draft.findIndex((event) => event.id === eventId);
              if (index !== -1) {
                draft.splice(index, 1);
              }
            });
          });
        } catch (error) {
          console.error("Error setting up socket subscription", error);
        }

        // When no component is subscribed to this query, clean up:
        await cacheEntryRemoved;
        socket.close();
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              { type: "Event" as const, id: "LIST" }, // Cache the entire list
              ...result.map(({ id }) => ({ type: "Event" as const, id })), // Cache individual categories
            ]
          : [{ type: "Event" as const, id: "LIST" }],
    }),

    addEvent: builder.mutation<Event, FormData>({
      query: (formData) => ({
        url: "/event",
        method: "POST",
        // When sending FormData, fetchBaseQuery will set the Content-Type automatically
        body: formData,
      }),
      invalidatesTags: [{ type: "Event" as const, id: "LIST" }],
    }),

    attendEvent: builder.mutation<SuccessMessage, { eventId: string }>({
      query: ({ eventId }) => ({
        url: `event/${eventId}/attend`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { eventId }) => [
        { type: "Event" as const, id: eventId }, // Invalidate only the deleted category
        { type: "Event" as const, id: "LIST" }, // Optionally refetch list
      ],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useAddEventMutation,
  useAttendEventMutation,
} = eventApiSlice;
