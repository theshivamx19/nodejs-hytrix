import mongoose from "mongoose";

const applicationDetailSchema = new mongoose.Schema({
    
    appliedDate : {
        type : Date,
        default : Date.now,
        index : true
    },
    status : {
        type : Number,
        default : 0,
        index : true
    },
    remark : {
        type : String,
        trim : true,
        index : true,
    },
    acknowledge : {
        type : Object
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default : null
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default : null
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        default : null
    },
    branch : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        default : null
    }
    
}, {timestamps : true})

const Applicationdetail = mongoose.model('Applicationdetail', applicationDetailSchema)
export default Applicationdetail;