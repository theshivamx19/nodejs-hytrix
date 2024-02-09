import mongoose from 'mongoose'
const complianceschema = new mongoose.Schema({
    act: {
        type: String,               /////Indicate the relevant statutory act governing the compliance requirement
        required: true,
        unique:true,
        trim: true,
        index:true
    },
    rule: {                         /////Specify the specific rule or regulation associated with the compliance entry
        type: String,
        required: true,
        trim: true,
        index:true
    },
    category: {                     ////Categorize the compliance entry based on relevant criteria, facilitating easy sorting and reporting
        type: mongoose.Schema.Types.ObjectId,
        ref : "Category",
    },
    state: {                     ////Categorize the compliance entry based on relevant criteria, facilitating easy sorting and reporting
        type: mongoose.Schema.Types.ObjectId,
        ref : "State",
    },
    form: {                     ////Indicate the form or format associated with the compliance entry if applicable
        type: Object,
        default : null
    },
    docattachment: {
        type: Object,
        default : null
    },    
    compliancetype: {       /////legal, environmental, or internal policy compliance combobox
        type: String,
        required: true,
        trim: true,
        index:true
    },  
    question: {
        type: String,
        required: true,
        trim: true,
        index:true
    },
    description : {
        type : String,
        required: true,
        trim : true,
        index : true
    },
    frequency: {           /////one-time requirement, monthly, annually,custom combobox
        type: String,
        required: true,
        trim: true,
        index:true
    },  
    risk: {           /////one-time requirement, monthly, annually,custom combobox
        type: String,
        required: true,
        trim: true,
        index:true
    },
    duedate: {
        type: Date, 
        default: null, 
        index: true 
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
    
})
const Compliance = mongoose.model("Compliance", complianceschema)

export default Compliance;