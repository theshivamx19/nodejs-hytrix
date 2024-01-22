import mongoose, { mongo } from "mongoose";

const checkListSchema = new mongoose.Schema({
    state : {
        type : String,
        required : true,
        trim : true,
        index : true 
    },
    act : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    rule : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        trim : true,
        index : true
    },
    status : {
        type : Boolean,
        default : false,
        trim : true,
        index : true
    },
    form : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    document : {
        type : Object,
        required : true,
        trim : true,
        index : true
    }

}, {timestamps : true})

const CheckList =   mongoose.model('CheckList', checkListSchema)
export default CheckList;