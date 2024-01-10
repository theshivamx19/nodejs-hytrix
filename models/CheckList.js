import mongoose from "mongoose";

const checkListSchema = new mongoose.Schema({
    company : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Company"
    },
    state : {
        type : String,
        required : true,
        trim : true
    },
    branchName : {
        type : String,
        required : true,
        trim : true,
    },
    appointmentDate : {
        type : Date,
    },
    executive : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Executive"
    },

}, {timestamps : true})

const CheckList = mongoose.model('CheckList', checkListSchema)

export default CheckList;