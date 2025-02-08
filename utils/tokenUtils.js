import jwt from "jsonwebtoken";

export const createAccessToken = (data) => {
  return jwt.sign(
    {
      data,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

export const createRefreshToken = (data) => {
  return jwt.sign(
    {
      data,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export const setRefreshCookie = (res, value, options = {}) => {
  const defaultOptions = {
    httpOnly: true, // Prevents client-side JS access
    secure: process.env.NODE_ENV === "production", // Secure in production
    sameSite: "Strict", // Prevents CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // Default: 7 days
    path: "/", // Available for all routes
    ...options, // Override defaults if needed
  };

  res.cookie("refreshCookie", value, defaultOptions);
};

export const clearRefreshCookie = (res) => {
  res.clearCookie("refreshCookie", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/",
  });
};
