import mongoose from "mongoose";

const applicationDetailSchema = new mongoose.Schema({
    appliedDate : {
        type : Date,
        default : Date.now,
        index : true
    },
    status : {
        type : [],
        required : true,
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
    }
}, {timestamps : true})

const Applicationdetail = mongoose.model('Applicationdetail', applicationDetailSchema)
export default Applicationdetail;