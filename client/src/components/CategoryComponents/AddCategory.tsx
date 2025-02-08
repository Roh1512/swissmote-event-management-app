import { useAddCategoryMutation } from "@/features/category/categoryApiSlice";
import { CategoryFormData } from "@/types/categoryTypes";
import { ValidationError } from "@/types/errorTypes";
import {
  extractValidationErrors,
  getApiErrorMessage,
} from "@/utils.ts/errorHandlers";
import { closeModal, openModal } from "@/utils.ts/modalUtils";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ButtonLoading from "../Loading/ButtonLoading";
import { PenLine, Plus } from "lucide-react";
import AlertText from "../ErrorComponents/AlertText";

const AddCategory = () => {
  const modalId = "add-category-modal";
  const inputRef = useRef<HTMLInputElement>(null);

  const initialCategory = useMemo(() => {
    return { title: "" };
  }, []);
  const [categoryDetails, setCategoryDetails] =
    useState<CategoryFormData>(initialCategory);

  const [apiError, setApiError] = useState<string | null>(null);

  const [validationErrors, setValidationErrors] = useState<
    ValidationError[] | []
  >([]);

  const titleError: ValidationError | undefined = validationErrors.find(
    (error) => error.field === "title"
  );

  const reset = useCallback(() => {
    setCategoryDetails(initialCategory);
    setApiError(null);
    setValidationErrors([]);
  }, [initialCategory]);

  const [addCategory, { isLoading, isError, error, isSuccess }] =
    useAddCategoryMutation();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValidationErrors([]);
      setApiError(null);
      const { name, value } = e.target;
      setCategoryDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleAddCategory = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await addCategory(categoryDetails).unwrap();
        console.log(res);
      } catch (error) {
        console.error("Error Adding category ", error);
      }
    },
    [addCategory, categoryDetails]
  );

  console.log("VE: ", validationErrors);

  useEffect(() => {
    if (isError && error) {
      const extractedValidationErrors = extractValidationErrors(error);

      if (extractedValidationErrors) {
        setValidationErrors(extractedValidationErrors);
      } else {
        const errorMessage = getApiErrorMessage(error);
        setApiError(errorMessage || "Error adding cateory");
      }
    }
  }, [error, isError]);

  useEffect(() => {
    if (isSuccess) {
      inputRef?.current?.focus();
      reset();
    }
  }, [isSuccess, reset]);

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
        className="btn bg-green-900 hover:bg-green-700 shadow-slate-700 shadow-md text-white fixed bottom-7 right-6 text-lg font-bold"
        onClick={open}
      >
        {isLoading ? (
          <ButtonLoading text="Creating" />
        ) : (
          <>
            <span>Add New</span> <Plus className="w-6 h-6" />
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

          <h3>Add Category</h3>

          <form onSubmit={handleAddCategory}>
            <fieldset disabled={isLoading}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="input input-bordered flex items-center gap-2"
                >
                  <PenLine />
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="grow"
                    placeholder="Enter Category title"
                    // value={brandDetails.title || ""}
                    // onChange={handleChange}
                    value={categoryDetails.title}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    ref={inputRef}
                  />
                </label>
                {titleError ? <AlertText text={titleError?.message} /> : <br />}
              </div>
              <button className="btn-neutral w-full text-2xl">
                {isLoading ? <ButtonLoading text="Adding" /> : "Add New"}
              </button>
            </fieldset>
            <br />
            {apiError ? <AlertText text={apiError} /> : <br />}
          </form>
        </div>
      </dialog>
    </>
  );
};

export default AddCategory;
