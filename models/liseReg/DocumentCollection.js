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
    }

}, { timestamps: true })

const DocumentCollection = mongoose.model('Namerate', docCollectionSchema)
export default DocumentCollection