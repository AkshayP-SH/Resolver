import Notification from '../models/Notification.js';
import { sendEmailNotification } from './emailService.js';

export const createNotification = async (userId, type, message, complaintId) => {
    try {
        const notification = new Notification({
            user: userId,
            type,
            message,
            complaint: complaintId
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
};

export { sendEmailNotification };