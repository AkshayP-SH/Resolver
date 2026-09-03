import express from 'express';
import Complaint from '../models/Complaint.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const totalResolved = await Complaint.countDocuments({ status: 'RESOLVED' });
    
    const avgTimeAgg = await Complaint.aggregate([
      { $match: { status: 'RESOLVED' } },
      { $project: { resolutionTime: { $subtract: ['$updated_at', '$created_at'] } } },
      { $group: { _id: null, avgTime: { $avg: '$resolutionTime' } } }
    ]);

    let avgTimeHours = 0;
    if (avgTimeAgg.length > 0 && avgTimeAgg[0].avgTime) {
      avgTimeHours = Math.round(avgTimeAgg[0].avgTime / (1000 * 60 * 60));
    }

    res.json({ totalResolved, avgTimeHours });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;