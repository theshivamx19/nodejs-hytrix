import mongoose from 'mongoose';

const generalASchema = new mongoose.Schema({
    companyname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    companydetails: {
        type: String,
        trim: true,
        default:null,
        index: true
    },
    companyimage: {
        type: Object,
    },
    companyremark: {
        type: String,
        trim: true,
        default:null,
        index: true
    },
    companyaddress: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    companystate: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    companydistrict: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    companypin: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    comapnyaddressdetails :{
        type: String,
        default:null,
        trim: true,
        index: true
    },
    companyaddressimage: {
        type: Object,
    },
    companyaddressremark: {
        type: String,
        default:null,
        trim: true,
        index: true
    },
    companytype: {
        type: String,
        default:null,
        trim: true,
        index: true
    },
    companytypedetails: {
        type: String,
        default:null,
        trim: true,
        index: true
    },
    companytypeimage: {
        type: Object,
    },
    companytyperemark: {
        type: String,
        default:null,
        trim: true,
        index: true
    },
    companycategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    companycategorydetails: {
        type: String,
        trim: true,
        default:null,
        index: true
    },
    companycategoryimage: {
        type: Object,
    },
    companycategoryremark: {
        type: String,
        trim: true,
        default:null,
        index: true,
    },
    companynatureofbusiness: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    companynatureofbusinessdetails: {
        type: String,
        trim: true,
        default:null,
        index: true,
    },
    companynatureofbusinessimage: {
        type: Object,
    },
    companynatureofbusinessremark: {
        type: String,
        trim: true,
        default:null,
        index: true,
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

const GeneralA = mongoose.model('GeneralA', generalASchema)
export default GeneralA;