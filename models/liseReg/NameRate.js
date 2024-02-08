import mongoose from "mongoose";

const nameRateSchema = new mongoose.Schema({
    regNo: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    rate: {
        type: String,
        required: true,
        index: true
    },
    status: {
        type: Number,
        default: 0,
        index: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default : null
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default : null
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        default : null
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        default : null
    },
}, { timestamps: true })

const Namerate = mongoose.model('Namerate', nameRateSchema)
export default Namerate;