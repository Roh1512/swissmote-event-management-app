import { body } from "express-validator";
import prisma from "../configs/prismaClient.js";

export const categoryValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 3 })
    .withMessage("Category must be at least 3 characters long")
    .custom(async (value) => {
      const existingCategory = await prisma.category.findUnique({
        where: { title: value },
      });
      if (existingCategory) {
        throw new Error("Category with this title already exists");
      }
    }),
];
