import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes/index.js";
import {
    securityHeaders,
    mongoSanitizeMiddleware,
    corsOptions,
    requestSizeLimit,
    securityLogger,
    apiRateLimit
} from "./middleware/security.js";
import { sanitizeInputs } from "./validators/index.js";

const app = express();

// Enhanced Security Middleware
app.use(securityHeaders);

// CORS Configuration
app.use(cors(corsOptions));

// Request size limiting
app.use(requestSizeLimit);

// MongoDB injection protection
app.use(mongoSanitizeMiddleware);

// Security audit logging
app.use(securityLogger);

// Rate limiting for API endpoints
app.use('/api', (req, res, next) => {
    if (req.path === '/health') {
        return next();
    }
    return apiRateLimit(req, res, next);
});

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

// Body parsing middleware (with size limits)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Input sanitization
app.use(sanitizeInputMiddleware);

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
    // Log error for debugging
    console.error('🚨 ERROR:', err);
    
    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(isDevelopment && { stack: err.stack })
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

export default app;
