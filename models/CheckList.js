import mongoose, { mongo } from "mongoose";

const checkListSchema = new mongoose.Schema({
    state : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "State",
    },
    act : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    branchname: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
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
    },
    status : {
        type : Number,
        default : 0,
        trim : true,
        index : true
    },
    description : {
        type : String,
        trim : true,
        index : true
    },
    image : {
        type : Object,
        index : true
    },
    documents : {
        type : Object,
        index : true
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Executive"
    },
    compliances:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Compliances"
    },
    risk :{
        type : String,
        required : true,
        trim : true,
        index : true
    },
    approvedate:{
        type : String,
        // required : true,
        default: Date.now,
        trim : true,
        index : true
    },
    date : { 
        type: Date, 
        default: Date.now, 
        index: true 
    },
})

const CheckList =   mongoose.model('CheckList', checkListSchema)
export default CheckList;
