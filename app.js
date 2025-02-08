import createError from "http-errors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import uploadRouter from "./routes/uploadImage.js";
import authRouter from "./routes/auth.route.js";
import eventsRouter from "./routes/events.route.js";
import categoryRouter from "./routes/category.route.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "client", "dist")));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/events", eventsRouter);
app.use("/api/category", categoryRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error.";
  const errors = Array.isArray(err.errors) ? err.errors : [];
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    errors,
  });
});

export default app;
