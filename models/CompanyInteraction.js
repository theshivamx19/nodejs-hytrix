import mongoose from 'mongoose';

const companyInteractionSchema = new mongoose.model({
    title : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    details : {
        type : String,
        trim : true,
        index : true
    },
    companyUpload : {
        type : Object
    },
    remark : {
        type : String,
        trim : true,
        index : true
    },
    licenseName : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    licenseUpload : {
        type : Object
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

}, {timestamps : true})

const Companyinteraction = mongoose.model('Companyinteraction', companyInteractionSchema)
export default Companyinteraction;