import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const router = express.Router();

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
            maxAge: 24 * 60 * 60 * 1000 
        });
        
        res.json({ 
            message: "Login successful",    
            user: { id: existuser._id, name: existuser.name, email: existuser.email, role: existuser.role }
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
            maxAge: 24 * 60 * 60 * 1000 
        });
        
        res.status(201).json({ message: 'User registered successfully', user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } });
    } catch (error) {
        res.status(500).json({message:"registration error",error});   
    }
})

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