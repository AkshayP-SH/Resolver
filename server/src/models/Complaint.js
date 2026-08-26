import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true ,enum: ['Infrastructure', 'Electricity', 'Water', 'Sanitation', 'Safety', 'IT', 'Other']},
    location: { type: String, required: true },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH','URGENT'], default: 'MEDIUM' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], default: 'SUBMITTED' }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
}
});

const Complaint= mongoose.model('Complaint',ComplaintSchema);
export default Complaint