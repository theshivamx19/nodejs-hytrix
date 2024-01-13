import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true,
    },
    company : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Company"
    },
    state : {
        type : String,
        required : true, 
        trim : true,
    },
    branch : {
        type : String,
        required : true,
        trim : true,
    },
    startDate : {
        type : Date,
    },
    endDate : {
        type : Date
    },
    scope : {
        type : String,
        required : true, 
        trim : true,
    },
    auditor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Auditor"
    }

}, {timestamps : true})

const Audit = mongoose.model("Audit", auditSchema)
export default Audit;