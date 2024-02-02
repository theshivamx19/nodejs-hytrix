import mongoose from "mongoose";

const nameRateSchema = new mongoose.Schema({
    regNo : {
        type : String,
        required : true,
        unique : true,
        index : true
    },
    rate : {
        type : Number,
        required : true,
        index : true
    }
}, {timestamps : true})

const Namerate = mongoose.model('Namerate', nameRateSchema)
export default Namerate;