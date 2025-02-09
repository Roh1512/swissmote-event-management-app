import React from "react";
import { EventData } from "@/types/eventTypes";
import DeleteEvent from "./DeleteEvent";

type Props = {
  event: EventData;
};

const MyEvent: React.FC<Props> = ({ event }) => {
  // Convert dates to human-readable strings.
  const eventDate = new Date(event.date).toLocaleDateString();
  const createdAt = new Date(event.createdAt).toLocaleString();

  return (
    <div className="card card-compact md:card-side bg-base-100 shadow-xl mb-6">
      {event.imageUrl && (
        <figure className="w-full md:w-1/3">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="object-cover h-full w-full"
            loading="lazy"
          />
        </figure>
      )}
      <div className="card-body w-full">
        <h2 className="card-title text-2xl font-bold">{event.title}</h2>
        {event.description && (
          <p className="mt-2 text-base">{event.description}</p>
        )}
        <div className="divider"></div>
        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-semibold">Date:</span> {eventDate}
          </p>
          <p>
            <span className="font-semibold">Category:</span>{" "}
            {event.category.title}
          </p>
          <p>
            <span className="font-semibold">Created by:</span>{" "}
            {event.createdBy.username} ({event.createdBy.email})
          </p>
          <p>
            <span className="font-semibold">Created at:</span> {createdAt}
          </p>
        </div>
        <div className="card-actions justify-between mt-4">
          <DeleteEvent event={event} eventId={event.id} />
          <div className="flex flex-col items-end">
            <span className="badge badge-primary mb-2">
              {event.attendees.length} Attendee
              {event.attendees.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEvent;
