import express from 'express';
import Comment from '../models/Comment.js';
import Complaint from '../models/Complaint.js';

const router = express.Router();

router.get('/:complaintid', async (req, res) => {
    try {
        const comments = await Comment.find({ complaint: req.params.complaintid })
            .populate('user', 'name email role')
            .sort({ createdAt: 1 });
        res.json({ comments });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const { complaintId , text } = req.body;
        if ( !complaintId || !text ) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const newComment = new Comment({ complaint: complaintId, user: req.user._id, text,});
        await newComment.populate('user', 'name email role');
        await newComment.save();
        res.status(201).json({ message: 'Comment created successfully', comment: newComment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating comment', error: error.message });
    }
})

export default router;