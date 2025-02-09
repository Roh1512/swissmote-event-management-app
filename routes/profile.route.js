import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateMiddleware.js";
import { getProfile } from "../controllers/profileController.js";

const router = Router();

router.get("/", authenticateUser, getProfile);

export default router;
