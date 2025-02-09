import express from "express";
import { authenticateUser } from "../middlewares/authenticateMiddleware.js";
import { getMyEvents, deleteEvent } from "../controllers/events.controller.js";

const router = express.Router();

router.get("/", authenticateUser, getMyEvents);
router.delete("/:eventId", authenticateUser, deleteEvent);

export default router;
