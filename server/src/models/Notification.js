import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
        type: String, 
        enum: ['ASSIGNED', 'STATUS_CHANGE', 'COMMENT'], 
        required: true 
    },
    message: { type: String, required: true },
    complaint: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;