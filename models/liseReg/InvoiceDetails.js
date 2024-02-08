import mongoose from "mongoose";

const invoiceDetailSchema = new mongoose.Schema({
    invoiceType : {
        type : String,
        required : true,
        index : true
    },
    invoiceDate : {
        type : Date,
        default : Date.now,
        index : true
    },
    invoiceNumber : {
        type : String,
        required : true,
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
        required : true,
        default : 0,
        index : true
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
    },
}, {timestamps : true})

const Invoicedetail = mongoose.model('Invoicedetail', invoiceDetailSchema)
export default Invoicedetail;