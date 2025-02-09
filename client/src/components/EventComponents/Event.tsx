import React from "react";
import { EventData } from "@/types/eventTypes";
import AttendEvent from "./AttendEvent";

type Props = {
  event: EventData;
};

const Event: React.FC<Props> = ({ event }) => {
  return (
    <div className="card w-full max-w-4xl bg-base-100 shadow-xl my-4">
      {event.imageUrl && (
        <figure>
          <img
            src={event.imageUrl}
            alt={event.title}
            className="object-cover w-full h-48"
            loading="lazy"
          />
        </figure>
      )}
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold">{event.title}</h2>
        {event.description && (
          <p className="mt-2 text-base">{event.description}</p>
        )}
        <div className="divider my-4"></div>
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="text-sm text-gray-600">
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {event.category.title}
            </p>
            <p>
              <span className="font-semibold">Created By:</span>{" "}
              {event.createdBy.username}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <AttendEvent eventId={event.id} />
            <div className="mt-2">
              <span className="badge badge-primary">
                {event.attendees ? event.attendees.length : 0} Attendee
                {event.attendees && event.attendees.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;
