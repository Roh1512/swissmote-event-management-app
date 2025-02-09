import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../baseQuery";
import { EventData } from "@/types/eventTypes";
import { io } from "socket.io-client";
import { SuccessMessage } from "@/types/responseTypes";
import { serverURL } from "@/utils.ts/socketUtils";

export const myEventsApiSlice = createApi({
  reducerPath: "myEventsApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Profile", "MyEvents"],
  endpoints: (builder) => ({
    getMyEvents: builder.query<
      EventData[],
      {
        search?: string;
        page?: number;
      }
    >({
      query: (params) => ({
        url: "/myevent",
        method: "GET",
        params: {
          search: params.search,
          page: params.page,
        },
      }),
      async onCacheEntryAdded(
        _arg,
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
              { type: "MyEvents" as const, id: "LIST" },
              ...result.map(({ id }) => ({ type: "MyEvents" as const, id })),
            ]
          : [{ type: "MyEvents" as const, id: "LIST" }],
    }),
    deleteEvent: builder.mutation<SuccessMessage, { eventId: string }>({
      query: (params) => ({
        url: `/myevent/${params.eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { eventId }) => [
        { type: "MyEvents" as const, id: eventId },
        { type: "MyEvents" as const, id: "LIST" },
      ],
    }),
  }),
});

export const { useGetMyEventsQuery, useDeleteEventMutation } = myEventsApiSlice;
