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
            sameSite: 'strict',
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
            sameSite: 'strict',
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
        
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Logout error', error });
    }
});

export default router