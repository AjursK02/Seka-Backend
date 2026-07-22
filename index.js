const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

const connectDB = require("./src/config/db");
const waitlistRoutes = require("./src/routes/waitlistRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://seka-frontend-black.vercel.app",
  "https://seka.ajursinsights.com",
  "https://www.seka.ajursinsights.com",
];

const allowedOrigins = new Set(
  [
    ...defaultOrigins,
    ...(process.env.CLIENT_ORIGIN || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  ]
);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "SEKA backend is running",
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/waitlist", waitlistRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong",
  });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log("Backend server is running");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

if (process.env.VERCEL) {
  // Vercel loads the Express app directly instead of starting a long-lived listener.
  module.exports = app;
} else {
  startServer();
}
