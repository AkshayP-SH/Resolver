import * as Brevo from "@getbrevo/brevo";
import User from '../models/User.js';

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const sendEmail = async (to, subject, html) => {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.sender = { email: process.env.BREVO_SENDER_EMAIL }; 
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    await apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.CLIENT_ORIGIN}/reset-password/${resetToken}`;
    await sendEmail(email, 'Password Reset', `<a href="${resetUrl}">Reset Password</a>`);
};

export const sendEmailNotification = async (userId, subject, htmlContent) => {
    try {
        const user = await User.findById(userId);
        if (!user || user.emailNotifications === false) return;
        await sendEmail(user.email, subject, htmlContent);
    } catch (error) { console.error('Email error:', error); }
};