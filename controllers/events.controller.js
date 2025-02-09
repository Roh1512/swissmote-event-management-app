import upload from "../configs/multerConfig.js";
import { errorMessage, validationErrors } from "../utils/errorHandlers.js";
import prisma from "../configs/prismaClient.js";
import { body, validationResult } from "express-validator";
import { successMessage } from "../utils/successHandlers.js";
import { isDevEnv } from "../utils/devUtilts.js";
import { eventCreateValidators } from "../formValidators/eventFormValidators.js";
import { io } from "../bin/www";

export const getMyEvents = async (req, res, next) => {
  try {
    const { page = 1, search = "" } = req.query;
    const limit = 15;
    const pageNumber = Math.max(Number(page), 1);

    const userId = req.user.id;

    const totalEvents = await prisma.event.count({
      where: {
        createdById: userId,
        title: {
          startsWith: search,
          mode: "insensitive",
        },
      },
    });

    const totalPages = Math.ceil(totalEvents / limit);

    if (pageNumber > totalPages) {
      return res.status(200).json([]);
    }

    const events = await prisma.event.findMany({
      where: {
        createdById: userId,
        title: {
          startsWith: search,
          mode: "insensitive",
        },
      },
      include: {
        category: {
          select: {
            id: true,
            title: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        attendees: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      skip: (pageNumber - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return next(errorMessage(500, "Error fetching events"));
  }
};

export const getAllEvents = async (req, res, next) => {
  try {
    const { page = 1, search = "" } = req.query;
    const limit = 15;
    const pageNumber = Math.max(Number(page), 1);

    const totalEvents = await prisma.event.count({
      where: {
        title: {
          startsWith: search,
          mode: "insensitive",
        },
      },
    });

    const totalPages = Math.ceil(totalEvents / limit);

    if (pageNumber > totalPages) {
      return res.status(200).json([]);
    }

    const events = await prisma.event.findMany({
      where: {
        title: { startsWith: search, mode: "insensitive" },
      },
      include: {
        category: {
          select: {
            id: true,
            title: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        attendees: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      skip: (pageNumber - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(events);
  } catch (error) {
    isDevEnv && console.error("Error fetching events: ", error);
    return next(errorMessage(500, "Error fetching events"));
  }
};

export const addEvent = [
  upload.single("image"),
  eventCreateValidators,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(validationErrors(400, errors.array()));
    }

    try {
      const { title, description, date, categoryId } = req.body;
      let imageUrl = null;
      let publicId = null;

      const createdById = req.user.id;

      console.log("CURRENT USER: ", req.user);

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
        include: {
          category: {
            select: {
              id: true,
              title: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          attendees: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
      //Emit event to all connected clients
      io.emit("eventCreated", newEvent);
      return res.status(201).json(newEvent);
    } catch (error) {
      isDevEnv && console.error("Error adding event: ", error);
      return next(errorMessage(500, "Error creating event"));
    }
  },
];

export const attendEvent = [
  async (req, res, next) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;

      const [event, user] = await Promise.all([
        prisma.event.findUnique({
          where: { id: eventId },
          include: {
            attendees: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        }),
        prisma.user.findUnique({
          where: { id: userId },
        }),
      ]);

      console.log(event);

      if (!event) return next(errorMessage(404, "Event not found"));
      if (!user) return next(errorMessage(404, "User not found"));

      if (event.attendees.some((attendee) => attendee.id === userId)) {
        return next(
          errorMessage(400, "You are already registered for the event")
        );
      }
      await prisma.event.update({
        where: { id: eventId },
        data: {
          attendeeIds: { push: userId },
        },
      });
      io.emit("userAttending", { eventId, userId });
      return res
        .status(200)
        .json(successMessage("User is now attending the event"));
    } catch (error) {
      isDevEnv && console.error("Error attending to event: ", error);
      return next(errorMessage(500, "Error attending event"));
    }
  },
];

export const deleteEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        createdBy: true,
      },
    });

    console.log("EVENT: ", event);

    if (!event) {
      return next(errorMessage(404, "Event not found"));
    }
    if (event.createdBy.id !== req.user.id) {
      return next(errorMessage(403, "Forbidden"));
    }
    await prisma.event.delete({
      where: { id: eventId },
    });
    io.emit("eventDeleted", { eventId });
    return res.status(200).json(successMessage("Deleted event successfully"));
  } catch (error) {
    console.error(("Error deleting brand: ", error));
    return next(errorMessage(500, "Error deleting brand"));
  }
};
