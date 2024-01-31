import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        trim: true,
        index:true
    },
    role: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    externallink: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    image: {
        type: Object
    },
    isread: {
        type: Number,
        index: true,
    },
    dates : { 
        type: Date, 
        default: Date.now, 
        index: true 
    },
},
    {timestamps:true}
)
const Notification = mongoose.model("Notification", notificationSchema)

export default Notification;