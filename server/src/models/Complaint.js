import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
    status: { type: String, enum: ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']},
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    explanation: { type: String, maxlength: 1000 },
    timestamp: { type: Date, default: Date.now },
});

const ComplaintSchema = new mongoose.Schema({
    title: { type: String, maxlength: 150, required: true },
    description: { type: String, maxlength: 5000, required: true },
    category: { type: String, required: true ,enum: ['Infrastructure', 'Electricity', 'Water', 'Sanitation', 'Safety', 'IT', 'Other']},
    location: { type: String, maxlength: 200},
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH','URGENT'], default: 'MEDIUM' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'], default: 'SUBMITTED' },
    statusHistory: { type: [statusHistorySchema], default: [] }, 
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    attachment: {
        data: { type: Buffer },
        contentType: { type: String },
        filename: { type: String },
        size: { type: Number }
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Complaint = mongoose.model('Complaint', ComplaintSchema);
export default Complaint;