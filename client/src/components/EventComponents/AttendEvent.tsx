import { useAttendEventMutation } from "@/features/events/eventApiSlice";
import { getApiErrorMessage } from "@/utils.ts/errorHandlers";
import { memo, useEffect } from "react";
import { toast } from "react-toastify";

type Props = {
  eventId: string;
};

const AttendEvent = memo(({ eventId }: Props) => {
  const [attendEvent, { isLoading, isError, error }] = useAttendEventMutation();

  const handleAttend = async () => {
    try {
      const result = await attendEvent({ eventId }).unwrap();
      console.log("Attended event:", result);
      // Optionally show a success message
    } catch (err) {
      console.error("Error attending event:", err);
    }
  };

  useEffect(() => {
    if (isError && error) {
      const errorMessage = getApiErrorMessage(error);
      toast.error(errorMessage || "Error attending");
    }
  }, [error, isError]);
  return (
    <button
      onClick={handleAttend}
      disabled={isLoading}
      className="btn btn-primary"
    >
      Attend Event
    </button>
  );
});

export default AttendEvent;
