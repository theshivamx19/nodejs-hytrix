import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
    listField : {
        type : [String],
        trim : true
    }
}, {
    timestamps: true
})

export const List = mongoose.model('List', listSchema)
