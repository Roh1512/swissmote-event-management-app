import prisma from "../configs/prismaClient.js";

import { errorMessage, validationErrors } from "../utils/errorHandlers.js";

import bcryptjs from "bcryptjs";
import {
  clearRefreshCookie,
  createAccessToken,
  createRefreshToken,
  setRefreshCookie,
} from "../utils/tokenUtils.js";
import { body, validationResult } from "express-validator";
import { successMessage } from "../utils/successHandlers.js";
import { isDevEnv } from "../utils/devUtilts.js";

export const registerUser = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username must not be empty")
    .escape(),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Email must be in the format abcd@something.com")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password must not be empty"),

  async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username && !password && !email) {
      return next(
        errorMessage(
          400,
          "Please provide username,email and password to continue"
        )
      );
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(validationErrors(400, errors.array()));
    }

    try {
      const [duplicateUsername, duplicateEmail] = await Promise.all([
        prisma.user.findUnique({
          where: {
            username: username,
          },
        }),
        prisma.user.findUnique({
          where: {
            email: email,
          },
        }),
      ]);

      if (duplicateUsername)
        return next(errorMessage(400, "Username already exists"));
      if (duplicateEmail)
        return next(errorMessage(400, "Email already exists"));

      const hashedPassword = bcryptjs.hashSync(
        password,
        parseInt(process.env.PW_HASH)
      );
      const newUser = await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
          email: email,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      const accessToken = createAccessToken(newUser.id);
      const refreshToken = createRefreshToken(newUser.id);
      setRefreshCookie(res, refreshToken);
      res.status(201).json({
        accessToken: accessToken,
      });
    } catch (error) {
      isDevEnv && console.error("Error registering user: ", error);
      return next(error);
    }
  },
];

export const loginUser = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username must not be empty")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password must not be empty"),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(validationErrors(400, errors.array()));
      }
      const validUser = await prisma.user.findFirst({
        where: {
          OR: [{ username: username }, { email: username }],
        },
      });
      if (!validUser) {
        return next(errorMessage(404, "User not found for the given input"));
      }
      const validPassword = bcryptjs.compareSync(password, validUser.password);

      if (!validPassword) {
        return next(errorMessage(400, "Incorrect password"));
      }

      const accessToken = createAccessToken(validUser.id);
      const refreshToken = createRefreshToken(validUser.id);
      setRefreshCookie(res, refreshToken);
      res.status(200).json({
        accessToken: accessToken,
      });
    } catch (error) {
      isDevEnv && console.error("Error logging in: ", error);
      return next(error);
    }
  },
];

export const refreshAccessToken = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(errorMessage(403, "Unauthorized"));
    }
    console.log("USer: ", user);

    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    setRefreshCookie(res, refreshToken);
    return res.status(200).json({
      accessToken: accessToken,
    });
  } catch (error) {
    req.user = null;
    isDevEnv && console.error("Error refreshing: ", error);
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    req.user = null;
    clearRefreshCookie(res);
    return res.status(200).json(successMessage("Logout successful"));
  } catch (error) {
    isDevEnv && console.error("Error logging out");
    clearRefreshCookie(res);
    return next(500, "Error logging out");
  }
};
