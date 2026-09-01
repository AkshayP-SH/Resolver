   import express from 'express';
   import User from '../models/User.js';
   import protect from '../middleware/authMiddleware.js';

   const router = express.Router();

   router.get('/', async (req, res) => {
     try {
       const query = req.query.role ? { role: req.query.role } : {};
       const users = await User.find(query).select('-password');
       res.json(users);
     } catch (error) {
       res.status(500).json({ message: 'Server error' });
     }
   });

   export default router;