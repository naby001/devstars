import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    university: {
        type: String,
       // required: true,
    },
    city: {
        type: String,
        
    },
    isStudent: {
        type: String,
        
    },
    password: {
        type: String,
        
    },
    liked:[{
       type:String
    }],
    disliked:[{
        type:String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

export { User };