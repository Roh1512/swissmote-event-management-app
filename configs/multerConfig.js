import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js"; // Import configured Cloudinary instance

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "swissmoteEventManagementApp", // Cloudinary folder where images will be stored
    allowed_formats: ["jpg", "jpeg", "png", "webp"], // Allowed image formats
  },
});

const upload = multer({ storage });

export default upload;
