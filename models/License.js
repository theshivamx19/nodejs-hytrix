import mongoose from 'mongoose';

const licenseSchema = new mongoose.Schema({
    licenseName : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    licenseUpload : {
        type : Object
    },
    company : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Company"
    },
    state : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "State"
    },
    branch : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Branch"
    },
    executive : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    activatedDate : {
        type : Date,
        default : new Date(),
    },
    approved_at : {
        type : Date,
    },
    expiryDate : {
        type : Date,
    }

}, {timestamps : true})

const License = mongoose.model ('License', licenseSchema)
export default License;