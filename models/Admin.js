import mongoose from "mongoose"
const adminSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        min : 6,
        max : 16,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        max : 40,
        trim : true
    },
    userType : {
        type : String,
        required : true,
        trim : true,
    },
    password : {
        type : String,
        required : true,
        min : 6,
        max : 16,
        trim : true,
    },
    mobile : {
        type : Number,
        required : true,
        unique : true,
        trim : true,
    },
    status : {
        type : String,
        enum : ["Active", "Inactive"],
        default : "Inactive",
        required : true,
        trim : true,
    },
    image : {
        type : Object,
        required : true, 
        trim : true,
    }

}, {timestamps : true})

const Admin = mongoose.model("Admin", adminSchema)
export default Admin;