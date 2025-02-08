import type { Category } from "@/types/categoryTypes";
import DeleteCategory from "./DeleteCategory";

type Props = {
  category: Category;
};

const Category = ({ category }: Props) => {
  const currentCategoryId = category.id;
  return (
    <div className="bg-base-200 p-2 shadow-lg flex flex-row items-center justify-between min-w-64 rounded-xl max-h-fit">
      <h2 className="card-title text-2xl font-bold" tabIndex={0}>
        {category.title}
      </h2>
      <DeleteCategory category={category} categoryId={currentCategoryId} />
    </div>
  );
};

export default Category;
