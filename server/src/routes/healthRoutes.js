import express from 'express';

const router = express.Router();

// Health check endpoint - no authentication required
router.get('/health', (req, res) => {
    const healthCheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0'
    };
    
    try {
        res.status(200).json({
            success: true,
            data: healthCheck
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            message: 'Service Unavailable'
        });
    }
});

export default router;
