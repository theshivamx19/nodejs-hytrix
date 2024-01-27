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
    branchname: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Executive"
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
        type : Number,
        enum : [0, 1],
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
    document : {
        type : Object,
        index : true
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Executive"
    },
    compliances:{
        type : String,
        required : true,
        trim : true,
        index : true
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
