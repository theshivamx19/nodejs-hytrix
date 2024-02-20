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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    auditor: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    checklist: {
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
        type: Number,
        default : 0,
        required: true,
        trim: true,
        index: true
    },
    risk: {
        type: String,
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