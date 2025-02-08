import express from "express";
import {
  authenticateUser,
  verifyWithRefreshCookie,
} from "../middlewares/authenticateMiddleware.js";
import { successMessage } from "../utils/successHandlers.js";
import { errorMessage } from "../utils/errorHandlers.js";

const router = express.Router();

export default router;
