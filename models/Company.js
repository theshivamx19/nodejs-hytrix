import mongoose from 'mongoose'
const companySchema = new mongoose.Schema({
    companyname: {
        type: String,
        required: true,
        min: 6,
        max: 100,
        trim: true,
        index:true
    },
    state: {
        type: String,
        required: true,
        min: 6,
        max: 30,
        trim: true,
        index:true
    },
    branchname: {
        type: String,
        required: true,
        min: 6,
        max: 50,
        trim: true,
        index:true
    },
    executiveId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Executive",
        index:true
    },
    status  : { 
        type: Number, 
        index: true, 
        default: 0
    },    
    created_at : { 
        type: Date, 
        default: Date.now, 
        index: true 
    },
    updated_at : { 
        type: Date, 
        default: Date.now 
    }
})
const Company = mongoose.model("Company", companySchema)

export default Company;