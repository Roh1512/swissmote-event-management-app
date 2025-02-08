import { body } from "express-validator";

export const eventCreateValidators = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").optional().isString(),
  body("imageUrl").optional().isURL().withMessage("Invalid image URL"),
  body("date").isISO8601().toDate().withMessage("Invalid date format"),
  body("categoryId").trim().notEmpty().withMessage("Category ID is required"),
  body("createdById").trim().notEmpty().withMessage("CreatedBy ID is required"),
  body("date")
    .isISO8601()
    .withMessage("Date must be in ISO 8601 format (e.g., 2025-09-15T18:00:00Z)")
    .custom((value) => {
      const eventDate = new Date(value);
      const currentDate = new Date();

      // Ensure the event date is in the future
      if (eventDate <= currentDate) {
        throw new Error("Event date must be in the future");
      }

      return true;
    }),
];
