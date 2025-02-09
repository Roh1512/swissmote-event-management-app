import { useDeleteEventMutation } from "@/features/events/myEventsApiSlice";
import { EventData } from "@/types/eventTypes";
import { getApiErrorMessage } from "@/utils.ts/errorHandlers";
import { closeModal, openModal } from "@/utils.ts/modalUtils";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import IconLoading from "../Loading/IconLoading";
import { Trash2 } from "lucide-react";
import ButtonLoading from "../Loading/ButtonLoading";

type Props = {
  event: EventData;
  eventId: string;
};

const DeleteEvent = ({ event, eventId }: Props) => {
  const modalId = `deleteEventModal=${event.id}`;
  const [deleteEvent, { data, isLoading, isSuccess, isError, error }] =
    useDeleteEventMutation();
  const isDeleteLoading = isLoading && eventId === event.id;

  const handleDeleteEvent = useCallback(async () => {
    try {
      const res = await deleteEvent({ eventId: event.id }).unwrap();
      console.log(res);
      closeModal(modalId);
    } catch (error) {
      console.error(error);
    }
  }, [deleteEvent, event.id, modalId]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Event deleted");
    }
    if (isError && error) {
      const errorMessage = getApiErrorMessage(error);
      toast.error(errorMessage || "Error deleting event");
    }
  }, [data?.message, error, isError, isSuccess]);
  return (
    <>
      <button
        className="btn btn-sm btn-ghost text-red-700 hover:bg-error/10"
        aria-label="Delete"
        onClick={() => openModal(modalId)}
      >
        {isDeleteLoading ? <IconLoading /> : <Trash2 />}
      </button>

      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => closeModal(modalId)}
          >
            ✕
          </button>

          <div>
            <h2 className="text-xl font-bold mb-4">
              Delete Event: {event.title}
            </h2>
            <p className="text-gray-600">
              Are you sure you want to delete this brand? This action cannot be
              undone.
            </p>

            {/* Action Buttons */}
            <div className="modal-action">
              <button className="btn btn-error" onClick={handleDeleteEvent}>
                {isDeleteLoading ? <ButtonLoading text="Deleting" /> : "Delete"}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => closeModal(modalId)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DeleteEvent;
