import mongoose from 'mongoose'
const executiveSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 16,
        trim: true,
        index:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 40,
        trim: true,
        index:true
    },
    userType: {
        type: String,
        required: true,
        trim: true,
        index:true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 16,
        trim: true,
        index:true
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
        min: 10,
        max: 10,
        trim: true,
        index:true
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Inactive",
        required: true,
        trim: true,
        index:true
    },
    image: {
        type: Object
    },
    created_at : { 
        type: Date, 
        default: Date.now, 
        index: true 
    },
    updated_at : { 
        type: Date, 
        default: Date.now 
    }
})
const Executive = mongoose.model("Executive", executiveSchema)

export default Executive;