import createError from "http-errors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import eventsRouter from "./routes/events.route.js";
import categoryRouter from "./routes/category.route.js";
import myEventRouter from "./routes/myevents.route.js";
import profileRouter from "./routes/profile.route.js";

export const origin =
  process.env.NODE_ENV === "production"
    ? "https://event-management-app-brdd.onrender.com"
    : "http://localhost:5173";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "client", "dist")));

app.use(
  cors({
    origin: origin, // Allow all origins, or specify an origin (e.g., "http://localhost:3000")
    credentials: true, // Enable cookies and credentials if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  req.io = app.get("io");
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/event", eventsRouter);
app.use("/api/myevent", myEventRouter);
app.use("/api/category", categoryRouter);
app.use("/api/profile", profileRouter);

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
