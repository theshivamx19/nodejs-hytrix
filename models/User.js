import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    role: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique : true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },

}, { timestamps: true })

const User = mongoose.model('User', userSchema)
export default User;