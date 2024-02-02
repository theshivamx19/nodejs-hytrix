import mongoose from "mongoose";

const applicationDetailSchema = new mongoose.Schema({
    
    appliedDate : {
        type : Date,
        default : Date.now,
        index : true
    },
    status : {
        type : Number,
        required : true,
        default : 0,
        // enum : ['Verified', 'Under Process', 'Rejected'],
        index : true
    },
    remark : {
        type : String,
        trime : true,
        index : true,
        trim : true
    },
    acknowledge : {
        type : Object
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
    },
    branch : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
    }
    
}, {timestamps : true})

const Applicationdetail = mongoose.model('Applicationdetail', applicationDetailSchema)
export default Applicationdetail;