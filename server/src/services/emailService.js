import nodemailer from 'nodemailer';
import User from '../models/User.js';

// Brevo SMTP Transporter
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SENDER_EMAIL,
        pass: process.env.BREVO_API_KEY  // Use your Brevo API key as the SMTP password
    }
});

export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.CLIENT_ORIGIN}/reset-password/${resetToken}`;
    
    await transporter.sendMail({
        from: `"Resolver App" <${process.env.BREVO_SENDER_EMAIL}>`,
        to: email,
        subject: 'Password Reset - Resolver',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>Click below to reset your password:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">Reset Password</a>
            </div>
        `
    });
};

export const sendEmailNotification = async (userId, subject, htmlContent) => {
    try {
        const user = await User.findById(userId);
        if (!user || user.emailNotifications === false) return;
        
        await transporter.sendMail({
            from: `"Resolver App" <${process.env.BREVO_SENDER_EMAIL}>`,
            to: user.email,
            subject: subject,
            html: htmlContent
        });
    } catch (error) {
        console.error('Failed to send email notification:', error);
    }
};