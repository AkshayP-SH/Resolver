    import express from 'express';
    import Complaint from '../models/Complaint.js';
    import Comment from '../models/Comment.js';

    const router = express.Router();

    router.post('/', async (req, res) => {
        try{
            const { title, description, category, location, priority} = req.body;
            const newcomplaint = new Complaint({ 
                title, 
                description,
                category, 
                location, 
                priority,
                createdBy: req.user._id

                });
                await newcomplaint.save();
                res.status(201).json({ 
        message: 'Complaint created successfully', 
        complaint: newcomplaint 
        });
        } catch (error) {
            res.status(500).json({message:"complaint error",error});
        }
    })

    router.get('/', async (req, res) => {
        try {
            const { status, category, search, sort, mine, page, limit } = req.query;
            const filter = {};

            if (status) filter.status = status;
            if (category) filter.category = category;
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
            if (mine === 'true') filter.createdBy = req.user._id;

            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 10;
            const skip = (pageNum - 1) * limitNum;

            let query = Complaint.find(filter)
                .populate('createdBy', 'name email role')
                .populate('assignedTo', 'name email role');

            if (sort === 'oldest') {
                query = query.sort({ created_at: 1 });
            } else {
                query = query.sort({ created_at: -1 });
            }

            const total = await Complaint.countDocuments(filter);
            let complaints = await query.skip(skip).limit(limitNum);
            let finalTotal = total;

            if (sort === 'priority') {
                const allComplaints = await Complaint.find(filter)
                    .populate('createdBy', 'name email role')
                    .populate('assignedTo', 'name email role');
                
                const rank = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
                const sorted = allComplaints.sort((a, b) => (rank[a.priority] ?? 99) - (rank[b.priority] ?? 99));
                
                complaints = sorted.slice(skip, skip + limitNum);
                finalTotal = sorted.length;
            }

            res.json({ 
                complaints,
                pagination: {
                    total: finalTotal,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(finalTotal / limitNum)
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching complaints', error: error.message });
        }
    });

    router.get('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id).populate('createdBy', 'name email role').populate('assignedTo', 'name email role');

        if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
        }

        res.json({ complaint });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaint', error: error.message });
    }
    });

    router.put('/:id', async (req, res) => {
        try {
            const complaint = await Complaint.findById(req.params.id);
            if (!complaint) {
                return res.status(404).json({ message: 'Complaint not found' });
            }
            if (complaint.status === 'RESOLVED' || complaint.status === 'REJECTED') {
                return res.status(400).json({ message: 'Complaint already resolved/rejected' });
            }

            const { title, description, status, priority, assignedTo, explanation } = req.body;

            if (status && status !== complaint.status) {
                complaint.statusHistory.push({
                    status: status,
                    changedBy: req.user._id,
                    explanation: explanation || ''
                });
            }

            if (req.user.role === 'admin') {
                if (title) complaint.title = title;
                if (description) complaint.description = description;
                if (status) complaint.status = status;
                if (priority) complaint.priority = priority;
                if (assignedTo) {
                    complaint.assignedTo = assignedTo;
                    if (complaint.status === 'SUBMITTED') {
                        complaint.status = 'ASSIGNED';
                        complaint.statusHistory.push({
                            status: 'ASSIGNED',
                            changedBy: req.user._id,
                            explanation: 'Automatically assigned to staff'
                        });
                    }
                }
            } else if (req.user.role === 'staff') {
                if (status) complaint.status = status;
                if (assignedTo) {
                    complaint.assignedTo = req.user._id;
                    if (complaint.status === 'SUBMITTED') {
                        complaint.status = 'ASSIGNED';
                        complaint.statusHistory.push({
                            status: 'ASSIGNED',
                            changedBy: req.user._id,
                            explanation: 'Staff self-assigned'
                        });
                    }
                }
            } else {
                if (complaint.createdBy.toString() !== req.user._id.toString()) {
                    return res.status(403).json({ message: 'You are not authorized to update this complaint' });
                }
                if (title) complaint.title = title;
                if (description) complaint.description = description;
            }

            const updated = await complaint.save();

            const populated = await updated.populate([
                { path: 'createdBy', select: 'name email role' },
                { path: 'assignedTo', select: 'name email role' },
                { path: 'statusHistory.changedBy', select: 'name email role' }
            ]);

            res.json({ message: 'Complaint updated successfully', complaint: populated });

        } catch (error) {
            res.status(500).json({ message: 'Error updating complaint', error: error.message });
        }
    });

    router.post('/:id/upvote', async (req, res) => {
        try {
            const complaint = await Complaint.findById(req.params.id);
            if (!complaint) {
                return res.status(404).json({ message: 'Complaint not found' });
            }
            const alreadyUpvoted = complaint.upvotes.some(
                id => id.toString() === req.user._id.toString()
            );

            if (alreadyUpvoted) {
                complaint.upvotes = complaint.upvotes.filter(
                    id => id.toString() !== req.user._id.toString()
                );
            } else {
                complaint.upvotes.push(req.user._id);
            }

            await complaint.save();
            res.json({ message: alreadyUpvoted ? 'Upvote removed' : 'Complaint upvoted', complaint });
        } catch (error) {
            res.status(500).json({ message: 'Error upvoting complaint', error: error.message });
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const complaint = await Complaint.findById(req.params.id);

            if (!complaint) {
                return res.status(404).json({ message: 'Complaint not found' });
            }

            if (req.user.role === 'admin') {
                await Comment.deleteMany({ complaint: req.params.id });
                await Complaint.findByIdAndDelete(req.params.id);
                return res.json({ message: 'Complaint deleted successfully' });
            }

            if (req.user.role === 'staff') {
                return res.status(403).json({ message: 'Staff cannot delete complaints' });
            }

            if (req.user.role === 'user') {
                const isOwner = complaint.createdBy.toString() === req.user._id.toString();
                const canDelete = complaint.status === 'SUBMITTED' || complaint.status === 'REJECTED';

                if (isOwner && canDelete) {
                    await Comment.deleteMany({ complaint: req.params.id });
                    await Complaint.findByIdAndDelete(req.params.id);
                    return res.json({ message: 'Complaint deleted successfully' });
                }

                return res.status(403).json({ message: 'You can only delete your own submitted/rejected complaints' });
            }

        } catch (error) {
            res.status(500).json({ message: 'Error deleting complaint', error: error.message });
        }
    });

    export default router;