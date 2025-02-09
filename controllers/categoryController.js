import { errorMessage, validationErrors } from "../utils/errorHandlers.js";
import prisma from "../configs/prismaClient.js";
import { validationResult } from "express-validator";
import { successMessage } from "../utils/successHandlers.js";
import { isDevEnv } from "../utils/devUtilts.js";
import { categoryValidator } from "../formValidators/categoryFormValidators.js";

export const addCategory = [
  categoryValidator,
  async (req, res, next) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(validationErrors(400, errors.array()));
      }

      const { title } = req.body;

      // Create the category
      const newCategory = await prisma.category.create({
        data: { title },
      });

      return res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      return next(errorMessage(500, "Error creating category"));
    }
  },
];

export const deleteCategory = async (req, res, next) => {
  try {
    const { categoryid } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: categoryid },
      include: { events: true },
    });

    if (!category) {
      return next(errorMessage(404, "Category not found"));
    }

    if (category.events.length > 0) {
      return next(
        errorMessage(
          404,
          "Cannot delete category. Events are associated with this category."
        )
      );
    }

    await prisma.category.delete({
      where: { id: categoryid },
    });

    return res
      .status(200)
      .json(successMessage("Deleted category successfully"));
  } catch (error) {
    console.error("Error deleting category: ", error);
    return next(errorMessage(500, "Error deleting category"));
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const { page = 1, search = "" } = req.query;
    const limit = 15;
    const pageNumber = Math.max(Number(page), 1);

    const totalCategories = await prisma.category.count({
      where: {
        title: { startsWith: search, mode: "insensitive" }, // Case-insensitive search
      },
    });

    const totalPages = Math.ceil(totalCategories / limit);

    if (pageNumber > totalPages) {
      return res.status(200).json([]);
    }

    // Fetch paginated categories
    const categories = await prisma.category.findMany({
      where: {
        title: { startsWith: search, mode: "insensitive" },
      },
      skip: (pageNumber - 1) * limit, // Calculate offset
      take: limit, // Limit results per page
      orderBy: { createdAt: "desc" }, // Sort by newest
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories: ", error);
    return next(errorMessage(500, "Error fetching categories"));
  }
};
