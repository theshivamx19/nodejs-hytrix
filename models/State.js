import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
    name : {
        type : [String],
        required : true,
        trim : true,
        index : true
    },
    created_at : { 
        type: Date, 
        default: Date.now, 
        index: true 
    },
    updated_at : { 
        type: Date, 
        default: Date.now,
        index : true
    }
})

const State = mongoose.model('State', stateSchema)
export default State;