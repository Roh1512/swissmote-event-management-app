import upload from "../configs/multerConfig.js";
import { errorMessage } from "../utils/errorHandlers.js";
import prisma from "../configs/prismaClient.js";
import { body, validationResult } from "express-validator";
import { successMessage } from "../utils/successHandlers.js";
import { isDevEnv } from "../utils/devUtilts.js";
import { eventCreateValidators } from "../formValidators/eventFormValidators.js";

export const addEvent = [
  upload.single("image"),
  eventCreateValidators,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errorMessage(400, errors.array()));
    }

    try {
      const { title, description, date, categoryId, createdById } = req.body;
      let imageUrl = null;
      let publicId = null;

      const [category, user] = await Promise.all([
        prisma.category.findUnique({
          where: {
            id: categoryId,
          },
        }),
        prisma.user.findUnique({
          where: { id: createdById },
        }),
      ]);

      if (!category) return next(errorMessage(404, "Category not found"));
      if (!user) return next(errorMessage(404, "User not found"));

      if (req.file) {
        imageUrl = req.file.path; // Cloudinary URL
        publicId = req.file.filename; // Cloudinary public ID
      }

      const eventDate = new Date(date); //Date of the event

      const newEvent = await prisma.event.create({
        data: {
          title,
          description,
          imageUrl,
          date: eventDate, // Directly set the user-input date
          categoryId,
          createdById,
        },
      });
      return res.status(201).json(newEvent);
    } catch (error) {
      console.error("Error adding event: ", error);
      return next(errorMessage(500, "Error creating event"));
    }
  },
];
