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
    }
}, {timestamps : true})

const Licensedetail = mongoose.model('Licensedetail', licenseDetailSchema)
export default Licensedetail;