import mongoose from "mongoose";


const elibrarySchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Category"
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Executive"
    },
    placeholder: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    label: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    image : {
        type : Object
    },
    approveStatus : {
        type : String,
        required : true,
        trim : true,
        index : true
    }, 
    status : {
        type : Number,
        default : 0
    }

}, { timestamps: true })

const Elibrary = mongoose.model('Elibrary', elibrarySchema)
export default Elibrary;