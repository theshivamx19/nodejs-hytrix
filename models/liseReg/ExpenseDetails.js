import mongoose from "mongoose";

const expenseDetailSchema = new mongoose.Schema({
    challlanFees : {
        type : Number,
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
    }
}, {timestamps : true})

const Expensedetail = mongoose.model('Expensedetail', expenseDetailSchema)
export default Expensedetail