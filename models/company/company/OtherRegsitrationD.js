import mongoose from 'mongoose';

const otherRegistrationDSchema = new mongoose.Schema({
    pfnumber: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    pfdetails: {
        type: String,
        trim: true,
        default:null,
        index: true
    },
    pfimage: {
        type: Object,
    },
    pfdremark: {
        type: String,
        default:null,
        trim: true,
        index: true
    },
    doc: {
        type: Date,
        required: true,
        trim: true,
        index: true
    },
    pfstate: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    pfdistrict: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    setpfpin: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    pfaddressdetails: {
        type: String,
        trim: true,
        default:null,
        index: true
    },

    pfaddressimage: {
        type: Object
    },
    pfaddressremark: {
        type: String,
        trim: true,
        default:null,
        index: true
    },
    OtherRegsitrationD1PFsubcodes: {
        type:Array,
    },
    esinumber: {
        type: String,
        required:true,
        trim: true,
        index: true
    },
    esidetails: {
        type: String,
        trim: true,
        default:null,
        index: true
    },
    esiimage: {
        type: Object
    },
    esidremark: {
        type: String,
        trim: true,
        default:null,
        index: true
    },
    esidoc: {
        type: Date,
        required: true,
        trim: true,
        index: true
    },
    esiaddress: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    esistate: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    esidistrict: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    esipin: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    esiaddressdetails: {
        type: String,
        trim: true,
        required: true,
        index: true
    }, 
    esiaddressimage: {
        type: Object
    }, 
    esiaddressremark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },   
    OtherRegsitrationD1ESIsubcodes: {
        type:Array,
    },
    registrationD3: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    registrationD3details: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    registrationD3image: {
        type: Object
    },
    registrationD3remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },

    doregistrationD3: {
        type: Date,
        required: true,
        trim: true,
        index: true
    },            
    doeregistrationD3: {
        type: Date,
        required: true,
        index: true
    },
    doddrregistrationD3: {
        type: Date,
        required: true,
        index: true
    },
    noeD3: {
        type: Number,
        trim: true,
        index: true
    },
    noemD3: {
        type: Number,
        trim: true,
        index: true
    },
    noefD3: {
        type: Number,
        trim: true,
        index: true
    },
    issueauthfD3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    issueauthfD3details: {
        type: String,
        default:null,
        trim: true,
        index: true
    },
    issueauthfD3image: {
        type: Object
    },
    issueauthfD3remark: {
        type: String,
        default:null,
        trim: true,
        index: true
    },            
    fpD3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    fpD3details: {
        type: String,
        defualt:null,
        trim: true,
        index: true,
    },
    fpD3image: {
        type: Object
    },            
    fpD3remark: {
        type: String,
        trim: true,
        index: true
    },
    doapp: {
        type: Date,
        trim: true,
        index: true
    },
    powerfpD3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    powerfpD3details: {
        type: String,
        defualt:null,
        trim: true,
        index: true
    },
    powerfpD3image: {
        type: Object
    },            
    powerfpD3remark: {
        type: String,
        trim: true,
        index: true
    },
    powerhpfpD3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    powerhpfpD3details: {
        type: String,
        defualt:null,
        trim: true,
        index: true
    },
    powerhpfpD3image: {
        type: Object
    },            
    powerhpfpD3remark: {
        type: String,
        trim: true,
        index: true
    },
    issueauthfpD3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    issueauthfpD3details: {
        type: String,
        defualt:null,
        trim: true,
        index: true
    },
    issueauthfpD3image: {
        type: Object
    },            
    issueauthfpD3remark: {
        type: String,
        trim: true,
        index: true
    },
    registrationlwfD3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    registrationlwfD3details: {
        type: String,
        defualt:null,
        trim: true,
        index: true
    },
    registrationlwfD3image: {
        type: Object
    },            
    registrationlwfD3remark: {
        type: String,
        trim: true,
        index: true
    },
    doregistrationlwfD3: {
        type: Date,
        trim: true,
        index: true
    },        
    registrationptrD3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    registrationptrD3details: {
        type: String,
        defualt:null,
        trim: true,
        index: true
    },
    registrationptrD3image: {
        type: Object
    },            
    registrationptrD3remark: {
        type: String,
        trim: true,
        index: true
    },
    doregistrationptrD3: {
        type: Date,
        trim: true,
        index: true
    },   
    OtherRegsitrationD3NSP:{
        type:Array,
    },
    OtherRegsitrationD3OTP:{
        type:Array,
    },
    OtherRegsitrationD3WOE:{
        type:Array,
    },
    OtherRegsitrationD3TD:{
        type:Array,
    },
    OtherRegsitrationD3MSME:{
        type:Array,
    },
    OtherRegsitrationD3BOCW:{
        type:Array,
    },    
    OtherRegsitrationD3IMW:{
        type:Array,
    }, 
    // newly added
    OtherRegsitrationD3FL:{
        type:Array,
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

const OtherRegsitrationD = mongoose.model('OtherRegsitrationD', otherRegistrationDSchema)
export default OtherRegsitrationD;