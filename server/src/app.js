import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
// import dal from "./dal"; // Uncomment and implement dal.healthCheck if available

const app = express();

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Disable CSP for development
    hsts: false, // Disable HSTS for development
  })
);

// CORS Configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Debug Middleware for status code tracing
app.use((req, res, next) => {
  console.log(`🔍 DEBUG: ${req.method} ${req.path}`);
  console.log(`🔍 Headers:`, req.headers);

  // Override res.status to catch where 403 is being set
  const originalStatus = res.status;
  res.status = function (code) {
    if (code === 403) {
      console.error(`🚨 403 FORBIDDEN set for ${req.method} ${req.path}`);
      console.trace("Stack trace:");
    }
    return originalStatus.call(this, code);
  };

  next();
});

// Rate Limiting - exclude health endpoint
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});
app.use((req, res, next) => {
  if (req.path === "/api/health") {
    return next();
  }
  return limiter(req, res, next);
});

// Body parsing middleware (with size limits)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use("/api", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
