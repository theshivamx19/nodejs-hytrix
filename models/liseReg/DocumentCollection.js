import mongoose from "mongoose";

const docCollectionSchema = new mongoose.Schema({
    documents: {
        type: Object
    },
    docReqDate: {
        type: Date,
        default: Date.now,
        index: true
    },
    docReqFollow: {
        type: Date,
        index: true
    },
    docReviewDate: {
        type: Date,
        index: true
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

}, { timestamps: true })

const Documentcollection = mongoose.model('Documentcollection', docCollectionSchema)
export default Documentcollection