import mongoose from "mongoose";

const invoiceDetailSchema = new mongoose.Schema({
    invoiceType : {
        type : String,
        required : true,
        index : true
    },
    invoiceDate : {
        type : Date,
        index : true
    },
    invoiceNumber : {
        type : String,
        required : true,
        unique : true,
        index : true,
        trim : true
    },
    submissionDate : {
        type : Date,
        default : Date.now,
        index : true
    },
    status : {
        type : Number,
        default : 0,
        index : true
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
    },
}, {timestamps : true})

const Invoicedetail = mongoose.model('Invoicedetail', invoiceDetailSchema)
export default Invoicedetail;