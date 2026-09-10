import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    name: { type: String, maxlength: 50, required: true },
    email: { 
        type: String, maxlength: 254, required: true, unique: true, lowercase: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Invalid email'
        },
    },
    password: { type: String, maxlength: 128, required: false, minlength: 6 },
    googleId: { type: String},                  
    role: { type: String, enum: ['user', 'admin', 'staff'], default: 'user', message: '{VALUE} is not a valid role' },
    tokenVersion: { type: Number, default: 1 },
    emailNotifications: { type: Boolean, default: true },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date }
}, { timestamps: true });

UserSchema.index(
  { googleId: 1 },
  { unique: true, partialFilterExpression: { googleId: { $type: 'string' } } }
);

UserSchema.pre('save', async function(next) {
    if (!this.password || !this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', UserSchema);
export default User;