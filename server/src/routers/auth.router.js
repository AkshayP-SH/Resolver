import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

async function verifyGoogleToken(credential) {
    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
}

router.post('/login', async (req, res) => {
    try{
        const {email,password} = req.body;

        const existuser = await User.findOne({email});
        if(!existuser){
            return res.status(404).json({message:"Invalid username or password"});
        }
        
        const pmatch = await bcrypt.compare(password,existuser.password);
        if(!pmatch){
            return res.status(401).json({message:"Invalid username or password"});
        }

        const token = jwt.sign(
            { id: existuser._id, role: existuser.role, version: existuser.tokenVersion }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        });
        
        res.json({ 
            message: "Login successful",
            token: token,    
            user: { id: existuser._id, name: existuser.name, email: existuser.email, role: existuser.role, hasGoogle: !!existuser.googleId, hasPassword: !!existuser.password }     
           });


    } catch(error) {
        res.status(500).json({message:"login error",error});
    }
})
router.post('/register',async(req,res)=>{
    try{
        const { name, email, password} = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const newUser = new User({ name, email, password});
        await newUser.save();
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role, version: newUser.tokenVersion }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        });
        
        res.status(201).json({ message: 'User registered successfully',token:token, user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, hasGoogle: !!newUser.googleId, hasPassword: !!newUser.password } });
    } catch (error) {
        res.status(500).json({message:"registration error",error});   
    }   
})

router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ message: 'Missing Google credential' });

        let payload;
        try {
            payload = await verifyGoogleToken(credential);
        } catch (err) {
            console.error('Google token verification failed:', err);
            return res.status(401).json({ message: 'Invalid Google credential' });
        }

        const { sub: googleId, email, name: googleName, name: displayName } = payload;
        if (!email) return res.status(400).json({ message: 'Google account has no email' });

        let user = await User.findOne({ googleId });

        if (!user) {
            user = await User.findOne({ email });
            if (user) {
                user.googleId = googleId;
                await user.save();
            }
        }

        if (!user) {
            user = new User({
                name: googleName || displayName || email.split('@')[0],
                email,
                googleId,
                role: 'user',
            });
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, version: user.tokenVersion },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        });

        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, hasGoogle: !!user.googleId, hasPassword: !!user.password }
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ message: 'Google authentication failed', error: error.message });
    }
});


router.post('/google/link', protect, async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ message: 'Missing Google credential' });

        let payload;
        try {
            payload = await verifyGoogleToken(credential);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid Google credential' });
        }

        const { sub: googleId, email } = payload;

        if (email !== req.user.email) {
            return res.status(400).json({ message: 'Google account email must match your Resolver email' });
        }

        const existing = await User.findOne({ googleId });
        if (existing && existing._id.toString() !== req.user._id.toString()) {
            return res.status(400).json({ message: 'This Google account is already linked to another Resolver user' });
        }

        const user = await User.findById(req.user._id);
        user.googleId = googleId;
        await user.save();

        res.json({
            message: 'Google account connected',
            user: { id: user._id, name: user.name, email: user.email, role: user.role, hasGoogle: !!user.googleId, hasPassword: !!user.password }
        });
    } catch (error) {
        console.error('Google link error:', error);
        res.status(500).json({ message: 'Failed to link Google account', error: error.message });
    }
});

router.post('/google/unlink', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.googleId) {
            return res.status(400).json({ message: 'No Google account connected' });
        }
        if (!user.password) {
            return res.status(400).json({ message: 'Set a password first, otherwise you will be locked out' });
        }

        await User.updateOne({ _id: req.user._id }, { $unset: { googleId: 1 } });
        const updated = await User.findById(req.user._id);

        res.json({
            message: 'Google account disconnected',
            user: { id: user._id, name: user.name, email: user.email, role: user.role, hasGoogle: false, hasPassword: !!user.password }
        });
    } catch (error) {
        console.error('Google unlink error:', error);
        res.status(500).json({ message: 'Failed to unlink Google account', error: error.message });
    }
});


router.post('/logout', async (req, res) => {
    try {
        if (req.cookies?.token) {
            try {
                const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
                await User.findByIdAndUpdate(decoded.id, { $inc: { tokenVersion: 1 } });
            } catch (err) {
                console.error(err);
            }
        }

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Logout error', error });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.json({ message: 'If an account exists with that email, a reset link has been sent.' });
        }

        const crypto = await import('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        const { sendPasswordResetEmail } = await import('../services/emailService.js');
        await sendPasswordResetEmail(email, resetToken);

        res.json({ message: 'If an account exists with that email, a reset link has been sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        user.tokenVersion += 1;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router