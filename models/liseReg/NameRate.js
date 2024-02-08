import mongoose from "mongoose";

const nameRateSchema = new mongoose.Schema({
    regNo: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    rate: {
        type: Number,
        required: true,
        index: true
    },
    status: {
        type: Number,
        required: true,
        default: 0,
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
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
    },
}, { timestamps: true })

const Namerate = mongoose.model('Namerate', nameRateSchema)
export default Namerate;