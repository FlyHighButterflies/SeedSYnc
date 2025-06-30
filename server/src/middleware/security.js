import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import validator from 'validator';

// Enhanced rate limiting for different endpoints
const createRateLimit = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// Strict rate limiting for auth endpoints
export const authRateLimit = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // 5 attempts
    'Too many authentication attempts. Please try again in 15 minutes.'
);

// General API rate limiting
export const apiRateLimit = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    100, // 100 requests
    'Too many requests. Please try again later.'
);

// Search rate limiting (more lenient)
export const searchRateLimit = createRateLimit(
    1 * 60 * 1000, // 1 minute
    30, // 30 searches per minute
    'Too many search requests. Please slow down.'
);

// Enhanced security headers
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false, // For development
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});

// MongoDB injection protection
export const mongoSanitizeMiddleware = mongoSanitize({
    allowDots: true,
    replaceWith: '_'
});

// Input sanitization middleware
export const sanitizeInput = (req, res, next) => {
    const sanitizeValue = (obj) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'string') {
                    // Basic XSS protection
                    obj[key] = validator.escape(obj[key].trim());
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitizeValue(obj[key]);
                }
            }
        }
    };

    if (req.body) sanitizeValue(req.body);
    if (req.query) sanitizeValue(req.query);
    if (req.params) sanitizeValue(req.params);

    next();
};

// CORS configuration for production
export const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://yourdomain.com'
        ];
        
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Request size limiting middleware
export const requestSizeLimit = (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length']) || 0;
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (contentLength > maxSize) {
        return res.status(413).json({
            success: false,
            message: 'Request entity too large'
        });
    }
    
    next();
};

// Security audit logging
export const securityLogger = (req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logData = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userId: req.user?.id || 'anonymous'
        };
        
        // Log suspicious activities
        if (res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 429) {
            console.warn('🚨 SECURITY ALERT:', logData);
        } else if (process.env.NODE_ENV === 'development') {
            console.log('📝 REQUEST LOG:', logData);
        }
    });
    
    next();
};

// Account lockout tracking (in production, use Redis)
const failedAttempts = new Map();

export const accountLockout = (req, res, next) => {
    const identifier = req.body.email || req.ip;
    const attempts = failedAttempts.get(identifier) || { count: 0, lastAttempt: Date.now() };
    
    // Reset counter after 15 minutes
    if (Date.now() - attempts.lastAttempt > 15 * 60 * 1000) {
        attempts.count = 0;
    }
    
    // Block after 5 failed attempts
    if (attempts.count >= 5) {
        return res.status(429).json({
            success: false,
            message: 'Account temporarily locked due to too many failed attempts. Try again in 15 minutes.'
        });
    }
    
    // Track failed attempts
    res.on('finish', () => {
        if (res.statusCode === 401 && req.path.includes('/login')) {
            attempts.count++;
            attempts.lastAttempt = Date.now();
            failedAttempts.set(identifier, attempts);
        } else if (res.statusCode === 200 && req.path.includes('/login')) {
            // Reset on successful login
            failedAttempts.delete(identifier);
        }
    });
    
    next();
};
