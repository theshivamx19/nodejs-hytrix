import mongoose from 'mongoose';

const registrationBSchema = new mongoose.Schema({
    companyregistration: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    companyregistrationdetails: {
        type: String,
        trim: true,
        default:null,
        index: true
    },
    companyregistrationimage: {
        type: Object,
    },
    companyregistrationremark: {
        type: String,
        default:null,
        trim: true,
        index: true
    },
    companycin: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    companycindetails: {
        type: String,
        trim: true,
        index: true
    },
    companyciniamge: {
        type: Object
    },
    companycinremark: {
        type: String,
        trim: true,
        index: true
    },
    companyissuedplace: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    companyissuedplacedetails: {
        type: String,
        trim: true,
        index: true
    },
    companyissuedplaceimage: {
        type: Object
    },
    companyissuedplaceremark: {
        type: String,
        trim: true,
        index: true
    },
    companyauthority: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    companyauthoritydetails: {
        type: String,
        trim: true,
        default:null,
        index: true
    },
    companyauthorityimage: {
        type: Object
    },
    companyauthorityremark: {
        type: String,
        default:null,
        trim: true,
        index: true
    },            
    companyregistrationdate: {
        type: Date,
        required: true,
        default:null,
        index: true
    },
    companypan: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    companypandetails: {
        type: String,
        trim: true,
        index: true
    },
    companypanimage: {
        type: Object
    },
    companypanremark: {
        type: String,
        trim: true,
        index: true
    },            
    companytan: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    companytandetails: {
        type: String,
        trim: true,
        index: true
    },
    companytanimage: {
        type: Object
    },
    companytanremark: {
        type: String,
        trim: true,
        index: true
    },            
    companytin: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    companytindetails: {
        type: String,
        trim: true,
        index: true
    },
    companytinimage: {
        type: Object
    },
    companytinremark: {
        type: String,
        trim: true,
        index: true
    },            
    companygst: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    companygstdetails: {
        type: String,
        trim: true,
        index: true
    },
    companygstimage: {
        type: Object
    },
    companygstremark: {
        type: String,
        required: true,
        trim: true,
        index: true
    },            
    // companyB1nameofdirectors: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // companyB1directorsdetails: {
    //     type: String,
    //     default:null,
    //     trim: true,
    //     index: true,
    // },
    // companyB1directorsimage: {
    //     type: Object
    // },
    // companyB1directorsremark: {
    //     type: String,
    //     default:null,
    //     trim: true,
    //     index: true,
    // },
    // companyB1din: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // companyB1dindetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // companyB1dinimage: {
    //     type: Object
    // },
    // companyB1dinremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },            
    // companyB1pan: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // companyB1pandetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // companyB1panimage: {
    //     type: Object
    // },
    // companyB1panremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },            
    // companyB1aadhaar: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // companyB1aadhaardetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // companyB1aadhaarimage: {
    //     type: Object
    // },
    // companyB1aadhaarremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },            
    // companyB1mobile: {
    //     type: Number,
    //     trim: true,
    //     index: true,
    // },
    // companyB1mobiledetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // companyB1mobileremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },        
    // companyB1email: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // companyB1emaildetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // companyB1emailremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },        
    // companyB2nameauthforlisereg: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // companyB2designationauthforlisereg: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // companyB2panauthforlisereg: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // companyB2panauthforliseregdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // companyB2panauthforliseregimage: {
    //     type: Object
    // },
    // companyB2panauthforliseregremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },            
    // companyB2aadhaarauthforlisereg: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },   
    // companyB2aadhaarauthforliseregdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // }, 
    // companyB2aadhaarauthforliseregimage: {
    //     type: Object
    // }, 
    // companyB2aadhaarauthforliseregremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },                      
    // companyB2mobileauthforlisereg: {
    //     type: Number,
    //     trim: true,
    //     index: true,
    // },
    // companyB2mobileauthforliseregdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // companyB2mobileauthforliseregremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },        
    // companyB2emailauthforlisereg: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // companyB2emailauthforliseregdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // companyB2emailauthforliseregremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },    
    // companyB2letterauthforlisereg: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // companyB2letterauthforlisereg: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // companyB2letterauthforliseregdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // companyB2letterauthforliseregimage: {
    //     type: Object
    // },
    // companyB2letterauthforliseregremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },                
    // companyB3namecompactvities: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // companyB3namecompactvitiesdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // companyB3namecompactvitiesimage: {
    //     type: Object
    // },
    // companyB3namecompactvitiesremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },            
    // companyB3pancompactvities: {
    //     type: String,
    //     required:true,
    //     trim: true,
    //     index: true,
    // },       
    // companyB3pancompactvitiesdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },  
    // companyB3pancompactvitiesimage: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },  
    // companyB3pancompactvitiesremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },   
    // companyB3aadhaarcompactvities: {
    //     type: String,
    //     required:true,
    //     trim: true,
    //     index: true,
    // },       
    // companyB3aadhaarcompactvitiesdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },  
    // companyB3aadhaarcompactvitiesimage: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },  
    // companyB3aadhaarcompactvitiesremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // }, 
    // companyB3mobile: {
    //     type: Number,
    //     trim: true,
    //     index: true,
    // },   
    // companyB3mobiledetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // }, 
    // companyB3mobileremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },                   
    // companyB3email: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },   
    // companyB3emaildetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // }, 
    // companyB3emailremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },    
    // companyB3preffered: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },   
    // companyB3preffereddetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // }, 
    // companyB3prefferedremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },             
    RegistrationB1:{
        type:Array,
    },
    RegistrationB2:{
        type:Array,
    },
    RegistrationB3:{
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

const RegistrationB = mongoose.model('RegistrationB', registrationBSchema)
export default RegistrationB;