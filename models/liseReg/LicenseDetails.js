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

const Licensedetail = mongoose.model('Licensedetail', licenseDetailSchema)
export default Licensedetail;