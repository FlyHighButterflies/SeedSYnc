import express from 'express';
import notificationController from '../controllers/notificationController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, notificationController.createNotification);
router.get('/', authMiddleware, notificationController.getNotifications);
router.patch('/:id/read', authMiddleware, notificationController.markNotificationAsRead);
router.patch('/mark-all-read', authMiddleware, notificationController.markAllNotificationsAsRead);
router.delete('/:id', authMiddleware, notificationController.deleteNotification);

export default router;