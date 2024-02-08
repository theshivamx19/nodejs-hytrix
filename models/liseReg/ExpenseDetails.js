import mongoose from "mongoose";

const expenseDetailSchema = new mongoose.Schema({
    challlanFees : {
        type : String,
        required : true,
        index : true,
        trim : true
    },
    challanNumber : {
        type : String,
        required : true,
        unique : true,
        index : true,
        trim : true
    },
    challanDate : {
        type : Date,
        default : true,
        index : true
    },
    challanUpload : {
        type : Object
    },
    directExpenses : {
        type : String,
        index : true,
        trim : true
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

const Expensedetail = mongoose.model('Expensedetail', expenseDetailSchema)
export default Expensedetail