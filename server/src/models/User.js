import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    name: { type:String, required: true},
    email: { type:String, required: true, unique: true, lowercase: true,validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email'
    },},
    password: { type:String, required: true, minlength: 6},
    role: {type: String, enum: ['user', 'admin', 'staff'], default:'user',message:'{VALUE} is not a valid role'}
},
    {
        timestamps:true
    }
);

UserSchema.pre('save',async function(){
    if (!this.isModified('password')) return;
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);

    } catch(error){
        throw error;
    }
});

const User= mongoose.model('User',UserSchema);
export default User

