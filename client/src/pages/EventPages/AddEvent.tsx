import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
} from "react";
import { useAddEventMutation } from "@/features/events/eventApiSlice";
import { ApiError, ValidationError } from "@/types/errorTypes";
import {
  extractValidationErrors,
  getApiErrorMessage,
} from "@/utils.ts/errorHandlers";
import { closeModal, openModal } from "@/utils.ts/modalUtils";
import ButtonLoading from "@/components/Loading/ButtonLoading";
import { PenLine, Plus } from "lucide-react";
import AlertText from "@/components/ErrorComponents/AlertText";
import CategorySelect from "@/components/CategoryComponents/CategorySelect";

const AddEventComponent: React.FC = () => {
  const modalId = "add-event-modal";
  const [addEvent, { isLoading, isError, error }] = useAddEventMutation();

  // Event form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState(""); // Initially empty
  const [image, setImage] = useState<File | null>(null);

  // Error states
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );

  const titleError = validationErrors.find((error) => error.field === "title");
  const descriptionError = validationErrors.find(
    (error) => error.field === "description"
  );
  const dateError = validationErrors.find((error) => error.field === "date");
  const categoryError = validationErrors.find(
    (error) => error.field === "categoryId"
  );

  const reset = useCallback(() => {
    setApiError(null);
    setValidationErrors([]);
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("categoryId", categoryId);
    if (image) {
      formData.append("image", image);
    }
    try {
      const result = await addEvent(formData).unwrap();
      console.log("Event created:", result);
      // Optionally clear form fields or show success message...
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  useEffect(() => {
    if (isError && (error as ApiError)) {
      const extractedValidationErrors = extractValidationErrors(error);
      if (extractedValidationErrors.length > 0) {
        setValidationErrors(extractedValidationErrors);
      } else {
        const msg = getApiErrorMessage(error);
        setApiError(msg || "Error adding event");
      }
    }
  }, [error, isError]);

  const open = useCallback(() => {
    reset();
    openModal(modalId);
  }, [reset]);

  const close = useCallback(() => {
    reset();
    closeModal(modalId);
  }, [reset]);

  return (
    <>
      <button
        className="btn bg-green-900 hover:bg-green-700 shadow-slate-700 shadow-md text-white fixed bottom-7 right-6 text-lg font-bold z-20"
        onClick={open}
      >
        {isLoading ? (
          <ButtonLoading text="Creating" />
        ) : (
          <>
            <span>Add New Event</span> <Plus className="w-6 h-6" />
          </>
        )}
      </button>

      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={close}
          >
            ✕
          </button>

          <h3>Add Event</h3>

          <form onSubmit={handleSubmit}>
            <fieldset disabled={isLoading}>
              {/* Title */}
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="input input-bordered flex items-center gap-2"
                >
                  <PenLine />
                  <input
                    type="text"
                    id="title"
                    placeholder="Event title"
                    className="grow"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </label>
                {titleError ? (
                  <AlertText text={titleError.message as string} />
                ) : (
                  <br />
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <textarea
                  className="textarea textarea-bordered textarea-lg w-full max-w-lg"
                  placeholder="Event Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {descriptionError ? (
                  <AlertText text={descriptionError.message as string} />
                ) : (
                  <br />
                )}
              </div>

              {/* Date */}
              <div className="mb-4">
                <label htmlFor="date" className="block mb-1 font-semibold">
                  Date:
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />
                {dateError ? (
                  <AlertText text={dateError.message as string} />
                ) : (
                  <br />
                )}
              </div>

              {/* Category Select */}
              <div className="mb-4">
                <CategorySelect
                  value={categoryId}
                  onChange={(newId) => setCategoryId(newId)}
                  error={categoryError ? categoryError.message : undefined}
                />
              </div>

              {/* File Input */}
              <div className="mb-4">
                <label htmlFor="file" className="block mb-1 font-semibold">
                  Image (optional):
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                />
              </div>

              <button type="submit" className="btn">
                Add Event
              </button>
            </fieldset>
          </form>
          {apiError ? <AlertText text={apiError} /> : <br />}
        </div>
      </dialog>
    </>
  );
};

export default AddEventComponent;
