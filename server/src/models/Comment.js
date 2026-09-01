import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
   complaint:  { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
   user : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   text : { type: String, required: true },
    }, {
    timestamps: true
});

const Comment = mongoose.model('Comment',CommentSchema);
export default Comment