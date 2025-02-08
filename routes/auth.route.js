import express from "express";
import {
  loginUser,
  registerUser,
  refreshAccessToken,
  logout,
} from "../controllers/auth.controller.js";
import {
  authenticateUser,
  verifyWithRefreshCookie,
} from "../middlewares/authenticateMiddleware.js";
import { successMessage } from "../utils/successHandlers.js";
import { errorMessage } from "../utils/errorHandlers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", verifyWithRefreshCookie, refreshAccessToken);
router.post("/logout", verifyWithRefreshCookie, logout);
router.get("/check-auth", authenticateUser, async (req, res) => {
  try {
    return res.status(200).json(successMessage("Authenticated"));
  } catch (error) {
    return next(errorMessage(401, "Unauthorized"));
  }
});

export default router;
