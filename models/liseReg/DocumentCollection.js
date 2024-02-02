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
    docRegFollow: {
        type: Date,
        default: Date.now,
        index: true
    },
    docReviewDate: {
        type: Date,
        default: Date.now,
        index: true
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

}, { timestamps: true })

const Documentcollection = mongoose.model('Documentcollection', docCollectionSchema)
export default Documentcollection