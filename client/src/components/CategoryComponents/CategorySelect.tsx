// src/components/CategorySelect.tsx
import React, { useState, ChangeEvent } from "react";
import { useGetAllCategoriesQuery } from "@/features/category/categoryApiSlice";
import AlertText from "@/components/ErrorComponents/AlertText";

interface Category {
  id: string;
  title: string;
}

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  error,
}) => {
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // Always fetch page 1 and pass the search term; update as the user types
  const { data: categories, isLoading } = useGetAllCategoriesQuery({
    search,
    page: 1,
  });

  // When the dropdown is opened, we want to fetch with the current search term
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // When a category is selected, update the value and close the dropdown
  const handleSelect = (categoryId: string) => {
    onChange(categoryId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="border p-2 rounded cursor-pointer"
        onClick={toggleDropdown}
      >
        {value
          ? categories?.find((cat: Category) => cat.id === value)?.title ||
            "Select Category"
          : "Select Category"}
      </div>

      {isOpen && (
        <div className="absolute z-10 bg-white border mt-1 rounded w-full">
          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="w-full p-2 border-b"
          />
          <ul className="max-h-60 overflow-auto">
            {isLoading ? (
              <li className="p-2">Loading...</li>
            ) : categories && categories.length > 0 ? (
              categories.map((cat: Category) => (
                <li
                  key={cat.id}
                  onClick={() => handleSelect(cat.id)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {cat.title}
                </li>
              ))
            ) : (
              <li className="p-2">No categories found</li>
            )}
          </ul>
        </div>
      )}
      {error && <AlertText text={error} />}
    </div>
  );
};

export default CategorySelect;
