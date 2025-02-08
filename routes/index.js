import express from "express";
import { successMessage } from "../utils/successHandlers.js";
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  return res.status(200).json(successMessage("Index route"));
});

export default router;
