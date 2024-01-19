import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    branch: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Executive"
    },
    auditor: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    overdue: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    status: {
        type: String,
        enum: ["Ongoing", "Finding", "Completed", "Rejected"],
        default: "Ongoing",
        required: true,
        trim: true,
        index: true
    },
    risk: {
        type: String,
        enum: ["Ongoing", "High", "Low"],
        default: "Low",
        required: true,
        trim: true,
        index: true
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date,
        default: Date.now
    },


}, { timestamps: true })

const Audit = mongoose.model('Audit', auditSchema)
export default Audit;