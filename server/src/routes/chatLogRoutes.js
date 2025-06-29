import express from 'express';
import chatLogController from '../controllers/chatLogController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, chatLogController.createMessage);
router.get('/:chatRoomId', authMiddleware, chatLogController.getChatHistory);
router.patch('/:chatRoomId/read', authMiddleware, chatLogController.markMessagesAsRead);

export default router;