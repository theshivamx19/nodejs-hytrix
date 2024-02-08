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

const Companyinfo = mongoose.model('Companyinfo', companyInfoSchema)
export default Companyinfo;