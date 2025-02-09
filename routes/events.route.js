import express from "express";
import { authenticateUser } from "../middlewares/authenticateMiddleware.js";

import {
  addEvent,
  attendEvent,
  getAllEvents,
} from "../controllers/events.controller.js";

const router = express.Router();

router.get("/", authenticateUser, getAllEvents);
router.post("/", authenticateUser, addEvent);
router.post("/:eventId/attend", authenticateUser, attendEvent);

export default router;
