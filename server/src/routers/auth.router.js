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
            { id: existuser._id, role: existuser.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );
        res.json({ 
            message: "Login successful",
            token,
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
        res.status(201).json({ message: 'User registered successfully' , user: { id: newUser._id, name: newUser.name, email: newUser.email }});
    } catch (error) {
        res.status(500).json({message:"registration error",error});   
    }
})

export default router