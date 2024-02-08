import mongoose from "mongoose";

const licenseDetailSchema = new mongoose.Schema({
    licenseNumber : {
        type : String,
        unique : true,
        requied : true,
        index : true,
        trim : true
    },
    dateOfIssue : {
        type : Date,
        default : Date.now,
        index : true
    },
    renewalDate : {
        type : Date,
        default : Date.now,
        index : true
    },
    expireDate : {
        type : Date,
        default : Date.now,
        index : true
    },
    licenseUpload : {
        type : Object
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

const Licensedetail = mongoose.model('Licensedetail', licenseDetailSchema)
export default Licensedetail;