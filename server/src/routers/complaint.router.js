import express from 'express';
import Complaint from '../models/Complaint.js';

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
    try{
        if (req.query.mine === 'true') {
            filter.createdBy = req.user._id;
        }
        const complaints = await Complaint.find().populate('createdBy', 'name email role').populate('assignedTo', 'name email role').sort({ created_at: -1 });

        res.json(complaints);
    } catch (error) {
        res.status(500).json({message:"complaints not gound error",error});
    }
})

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
    try{
        const complaint = await Complaint.findById(req.params.id);
        if(!complaint){
            return res.status(404).json({message:"Complaint not found"});
        }
        if(complaint.status === "RESOLVED" || complaint.status === "REJECTED"){
            return res.status(400).json({message:"Complaint already resolved"});
        }
        const { title, description, status, priority, assignedTo } = req.body;

        if (req.user.role === 'admin') {
            if (title) complaint.title = title;
            if (description) complaint.description = description;
            if (status) complaint.status = status;
            if (priority) complaint.priority = priority;
            if (assignedTo) complaint.assignedTo = assignedTo;
        } else if(req.user.role === 'staff'){
            if (status) complaint.status = status;
            if (assignedTo) complaint.assignedTo = req.user._id;
        }else {
            if(complaint.createdBy.toString() !== req.user._id.toString()){
                return res.status(403).json({message:"You are not authorized to update this complaint"});
            }
            if (title) complaint.title = title;
            if (description) complaint.description = description;

        }
        const updated= await complaint.save();
        const populated = await updated.populate('createdBy', 'name email role');
        res.json({ message: 'Complaint updated successfully', complaint: populated });

    } catch (error) {
        res.status(500).json({ message: 'Error updating complaint', error: error.message });
    }
})

export default router;