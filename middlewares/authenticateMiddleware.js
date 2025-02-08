import jwt from "jsonwebtoken";
import { errorMessage } from "../utils/errorHandlers.js";
import prisma from "../configs/prismaClient.js";
import { clearRefreshCookie } from "../utils/tokenUtils.js";
import { isDevEnv } from "../utils/devUtilts.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshCookie;

    if (!refreshToken) return next(errorMessage(401, "Unauthorized"));
    const accessToken = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
    console.log(refreshToken, accessToken);
    if (!accessToken) return next(errorMessage(401, "Unauthorized"));

    let decodedAccessToken;
    let decodedRefreshToken;
    if (accessToken) {
      try {
        decodedAccessToken = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
      } catch (err) {
        isDevEnv && console.log("Invalid Access token: ", err);

        return next(errorMessage(401, "Unauthorized"));
      }
    }
    if (refreshToken) {
      try {
        decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
      } catch (err) {
        isDevEnv && console.log("Invalid Refresh token: ", err);
        clearRefreshCookie(res);
        return next(errorMessage(401, "Unauthorized"));
      }
    }
    if (decodedAccessToken.data !== decodedRefreshToken.data) {
      clearRefreshCookie(res);
      next(errorMessage(401, "Unauthorized"));
    }
    const user = await prisma.user.findUnique({
      where: {
        id: decodedAccessToken.data,
      },
      omit: {
        password: true,
      },
    });
    if (!user) {
      return next(errorMessage(404, "No user found"));
    }
    req.user = user;
    next();
  } catch (error) {
    isDevEnv && console.error("Error authentication user: ", error);
    next(errorMessage(401, "Authentication error"));
  }
};

export const verifyWithRefreshCookie = async (req, res, next) => {
  const refreshToken = req.cookies?.refreshCookie;

  if (!refreshToken) return next(errorMessage(403, "Unauthorized"));
  try {
    let decodedRefreshToken;
    if (refreshToken) {
      try {
        decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
      } catch (err) {
        isDevEnv && console.log("Invalid Refresh token: ", err);
        clearRefreshCookie(res);
        return next(errorMessage(403, "Unauthorized"));
      }
    }
    const user = await prisma.user.findUnique({
      where: {
        id: decodedRefreshToken.data,
      },
      omit: {
        password: true,
      },
    });
    if (!user) {
      clearRefreshCookie(res);
      return next(errorMessage(404, "User not found"));
    }
    req.user = user;
    next();
  } catch (error) {
    clearRefreshCookie(res);
    isDevEnv && console.error("Error refreshing token: ", error);
    next(errorMessage(401, "Unauthorized"));
  }
};
