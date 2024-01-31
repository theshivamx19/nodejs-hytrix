import mongoose from 'mongoose'
const complianceschema = new mongoose.Schema({
    state: {                        ////Specify the geographical region or state to which the compliance entry pertains
        type: mongoose.Schema.Types.ObjectId,
        ref : 'State'
    },
    act: {
        type: String,               /////Indicate the relevant statutory act governing the compliance requirement
        required: true,
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
    questiondesc: {             //////Provide a detailed description of the compliance question or requirement
        type: String,
        required: true,
        trim: true,
        index:true
    },
    form: {                     ////Indicate the form or format associated with the compliance entry if applicable
        type: String,
        trim: true,
        index:true
    },
    docattachment: {
        type: Object,
        required: true,
        index:true
    },    
    compliancetype: {       /////legal, environmental, or internal policy compliance combobox
        type: String,
        required: true,
        trim: true,
        index:true
    },  
    recurrence: {           /////one-time requirement, monthly, annually,custom combobox
        type: String,
        required: true,
        trim: true,
        index:true
    },  
    duedate: {
        type: Date, 
        default: Date.now, 
        index: true 
    },      
    url: {
        type: String,
        required: true,
        max: 60,
        trim: true,
        index:true
    },
    executiveId: {
        type: String,
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
const Compliance = mongoose.model("Compliance", complianceschema)

export default Compliance;