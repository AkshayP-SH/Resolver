   import express from 'express';
   import User from '../models/User.js';
   import protect from '../middleware/authMiddleware.js';
   import bcrypt from 'bcrypt';

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

   router.get('/me' , protect, async (req,res) => {
     try{
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);

     } catch (error) {
       res.status(500).json({ message: 'Server error' });
     }
   })

   router.put('/me', protect, async (req, res) => {
  try{
    const user = await User.findById(req.user._id);
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.body.name) user.name = req.body.name;

    if (req.body.password) {
      if (!req.body.currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = req.body.newPassword;
    }

    const updatedUser = await user.save();
    const UserObj = updatedUser.toObject();
    delete UserObj.password;

    res.json(UserObj);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
})

   router.get('/:id', async (req, res) => {
     try {
       const user = await User.findById(req.params.id).select('-password');
       if (!user) {
         return res.status(404).json({ message: 'User not found' });
       }
       res.json(user);
     } catch (error) {
       res.status(500).json({ message: 'Server error' });
     }
   });

   router.put('/:id', protect, async (req, res) => {
     try {
        const userToUpdate = await User.findById(req.params.id);

        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.role) {
            userToUpdate.role = req.body.role;
        }
        const updatedUser = await userToUpdate.save();
        
        const userObj = updatedUser.toObject();
        delete userObj.password;
        
        res.json(userObj);
     } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
     }
   });

   

   export default router;

