import mongoose from 'mongoose';

const companyProfileSchema = new mongoose.Schema({
    companyTitle: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    details: {
        type: String,
        trim: true,
        index: true
    },
    companyUpload: {
        type: Object
    },
    remark: {
        type: String,
        trim: true,
        index: true
    },

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State"
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

}, {timestamps : true})

const Companyprofile = mongoose.model('Companyprofile', companyProfileSchema)
export default Companyprofile;