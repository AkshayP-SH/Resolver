import User from '../models/User.js';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const sendBrevoEmail = async (toEmail, subject, htmlContent) => {
    const payload = {
        sender: { email: process.env.BREVO_SENDER_EMAIL, name: "Resolver App" },
        to: [{ email: toEmail }],
        subject: subject,
        htmlContent: htmlContent
    };

    const response = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY 
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Brevo API Error:', errorData);
        throw new Error(`Failed to send email: ${response.statusText}`);
    }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.CLIENT_ORIGIN}/reset-password/${resetToken}`;
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>Click below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">Reset Password</a>
        </div>
    `;
    await sendBrevoEmail(email, 'Password Reset - Resolver', html);
};

export const sendEmailNotification = async (userId, subject, htmlContent) => {
    try {
        const user = await User.findById(userId);
        if (!user || user.emailNotifications === false) return;
        await sendBrevoEmail(user.email, subject, htmlContent);
    } catch (error) {
        console.error('Failed to send email notification:', error);
    }
};