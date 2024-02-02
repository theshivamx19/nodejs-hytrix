import mongoose from "mongoose";

const companyInfoSchema = new mongoose.Schema({
    branch : {
        type : [],
        required : true,
        index : true,
        trim : true
    }
}, {timestamps : true})

const Companyinfo = mongoose.model('Companyinfo', companyInfoSchema)
export default Companyinfo;