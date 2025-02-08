import { useDeleteCategoryMutation } from "@/features/category/categoryApiSlice";
import type { Category } from "@/types/categoryTypes";
import { getApiErrorMessage } from "@/utils.ts/errorHandlers";
import { closeModal, openModal } from "@/utils.ts/modalUtils";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import ButtonLoading from "../Loading/ButtonLoading";
import IconLoading from "../Loading/IconLoading";
import { Trash2 } from "lucide-react";

type Props = {
  category: Category;
  categoryId: string;
};

const DeleteCategory = ({ category, categoryId }: Props) => {
  const modalId = `deleteModal=${category.id}`;
  const [deleteCategory, { data, isLoading, isSuccess, isError, error }] =
    useDeleteCategoryMutation();
  const isDeleteLoading = isLoading && categoryId === category.id;

  const handleDeleteCategory = useCallback(async () => {
    try {
      const res = await deleteCategory({ categoryId: category.id }).unwrap();
      console.log(res);
      closeModal(modalId);
    } catch (error) {
      console.error(error);
    }
  }, [category.id, deleteCategory, modalId]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Category Deleted");
    }
    if (isError && error) {
      const errorMessage = getApiErrorMessage(error);
      toast.error(errorMessage || "Error deleting category");
    }
  }, [data?.message, error, isError, isSuccess]);

  return (
    <>
      {/* Delete Button */}
      <button
        className="btn btn-sm btn-ghost text-red-700 hover:bg-error/10"
        aria-label="Delete"
        onClick={() => openModal(modalId)}
      >
        {isDeleteLoading ? <IconLoading /> : <Trash2 />}
      </button>

      {/* Modal */}
      <dialog id={modalId} className="modal">
        <div className="modal-box">
          {/* Close Button */}
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => closeModal(modalId)}
          >
            ✕
          </button>

          {/* Modal Content */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              Delete Brand: {category.title}
            </h2>
            <p className="text-gray-600">
              Are you sure you want to delete this brand? This action cannot be
              undone.
            </p>

            {/* Action Buttons */}
            <div className="modal-action">
              <button className="btn btn-error" onClick={handleDeleteCategory}>
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

export default DeleteCategory;
