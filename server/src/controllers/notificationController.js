import Notification from '../models/NotificationModel.js';

class NotificationController {
    async createNotification(req, res) {
        try {
            const { recipient, type, message, relatedEntity, relatedEntityType } = req.body;
            const notification = new Notification({
                recipient,
                type,
                message,
                relatedEntity,
                relatedEntityType,
            });
            await notification.save();
            res.status(201).json(notification);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getNotifications(req, res) {
        try {
            const userId = req.user.id; // Authenticated user's ID
            const { read, limit = 50, offset = 0 } = req.query;

            let query = { recipient: userId };
            if (read !== undefined) {
                query.read = read === 'true';
            }

            const notifications = await Notification.find(query)
                .sort({ createdAt: -1 })
                .skip(parseInt(offset))
                .limit(parseInt(limit));

            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async markNotificationAsRead(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id; // Authenticated user's ID

            const notification = await Notification.findOneAndUpdate(
                { _id: id, recipient: userId },
                { $set: { read: true } },
                { new: true }
            );

            if (!notification) {
                return res.status(404).json({ message: 'Notification not found or not authorized' });
            }

            res.status(200).json({ message: 'Notification marked as read', notification });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async markAllNotificationsAsRead(req, res) {
        try {
            const userId = req.user.id; // Authenticated user's ID

            await Notification.updateMany(
                { recipient: userId, read: false },
                { $set: { read: true } }
            );

            res.status(200).json({ message: 'All notifications marked as read' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteNotification(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id; // Authenticated user's ID

            const notification = await Notification.findOneAndDelete({ _id: id, recipient: userId });

            if (!notification) {
                return res.status(404).json({ message: 'Notification not found or not authorized' });
            }

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new NotificationController();