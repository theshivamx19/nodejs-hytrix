import mongoose from "mongoose";

const companyInfoSchema = new mongoose.Schema({
    branchName : {
        type : String,
        required : true,
        index : true,
        trim : true
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

const Companyinfo = mongoose.model('Companyinfo', companyInfoSchema)
export default Companyinfo;