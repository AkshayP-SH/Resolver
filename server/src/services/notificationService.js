import Notification from '../models/Notification.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

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

export const sendEmailNotification = async (userId, subject, htmlContent) => {
    try {
        const user = await User.findById(userId);
        if (!user || !user.emailNotifications) return;
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"Resolver App" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject,
            html: htmlContent
        });
    } catch (error) {
        console.error('Failed to send email notification:', error);
    }
};