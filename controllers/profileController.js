import { errorMessage } from "../utils/errorHandlers.js";

export const getProfile = async (req, res, next) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return next(errorMessage(500, "Failed to fetch profile"));
  }
};
