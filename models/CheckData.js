
import mongoose from "mongoose";

const checkDataSchema = new mongoose.Schema({
    name: [{
        _id: Number,
        value: String
    }],
    age: {
        type: String
    }
}, { timestamps: true })

const Checkdata = mongoose.model('Checkdata', checkDataSchema)
export default Checkdata