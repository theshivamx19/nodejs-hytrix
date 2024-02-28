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
    compliance:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Compliance"
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State"
    },
    auditor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // overdue: {
    //     type: String,
    //     default: null
    // },
    auditstatus: {
        type: String,
        default:null,
        index: true
    },
    risk: {
        type: String,
        index: true
    },
    score: {
        type: Number,
        index: true,
        default:null
    },
    briefauditor: {
        type: String,
        index: true,
        default:null
    },
    checkboxlist: {
        type: Array,
        index: true,
        default: null
    },
    start_date: {
        type: Date,
        default: null
    },
    end_date: {
        type: Date,
        default: null
    },
    status: {
        type: Number,
        default:0,
        index: true
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    updated_at:{
        type: Date,
        default: null
    }
})

const Audit = mongoose.model('Audit', auditSchema)
export default Audit;