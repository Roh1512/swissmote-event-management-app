import express from "express";
import upload from "../configs/multerConfig.js";
import { errorMessage } from "../utils/errorHandlers.js";

const router = express.Router();

router.post("/", upload.single("image"), (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorMessage(400, "No file uploaded"));
    }

    return res.json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path, // Cloudinary URL
      publicId: req.file.filename, // Cloudinary image ID
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return next(errorMessage(500, "Error uploading error"));
  }
});

export default router;
