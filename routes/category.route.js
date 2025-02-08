import express from "express";
import { authenticateUser } from "../middlewares/authenticateMiddleware.js";
import {
  addCategory,
  deleteCategory,
  getCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", authenticateUser, getCategories);
router.post("/", authenticateUser, addCategory);
router.delete("/:categoryid", authenticateUser, deleteCategory);

export default router;
