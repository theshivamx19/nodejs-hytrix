import mongoose from "mongoose";

const invoiceDetailSchema = new mongoose.Schema({
    invoiceType : {
        type : [],
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
    }
}, {timestamps : true})

const Invoicedetail = mongoose.model('Invoicedetail', invoiceDetailSchema)
export default Invoicedetail;