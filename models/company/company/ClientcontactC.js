import mongoose from 'mongoose';

const clientcontactCSchema = new mongoose.Schema({
    // clientcontactCname: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true
    // },
    // clientcontactCnamedetails: {
    //     type: String,
    //     trim: true,
    //     index: true
    // },
    // clientcontactCnameimage: {
    //     type: Object
    // },
    // clientcontactCnameremark: {
    //     type: String,
    //     trim: true,
    //     index: true
    // },
    // clientcontactCdesignation: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true
    // },
    // clientcontactCdesignationdetails: {
    //     type: String,
    //     trim: true,
    //     index: true
    // },
    // clientcontactCdesignationiamge: {
    //     type: Object
    // },
    // clientcontactCdesignationremark: {
    //     type: String,
    //     trim: true,
    //     index: true
    // },
    // clientcontactCmobile: {
    //     type: Number,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactCmobiledetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactCmobileremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },     
    // clientcontactCwhatsapp: {
    //     type: Number,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactCwhatsappdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactCwhatsappremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },    
    // clientcontactCpreffered: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },   
    // clientcontactCpreffereddetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // }, 
    // clientcontactCprefferedremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },       ////////start from here tommorrow
    // clientcontactissuedplace: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true
    // },
    // clientcontactissuedplacedetails: {
    //     type: String,
    //     trim: true,
    //     index: true
    // },
    // clientcontactissuedplaceimage: {
    //     type: Object
    // },
    // clientcontactissuedplaceremark: {
    //     type: String,
    //     trim: true,
    //     index: true
    // },
    // clientcontactauthority: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true
    // },
    // clientcontactauthoritydetails: {
    //     type: String,
    //     trim: true,
    //     index: true
    // },
    // clientcontactauthorityimage: {
    //     type: Object
    // },
    // clientcontactauthorityremark: {
    //     type: String,
    //     trim: true,
    //     index: true
    // },            
    // clientcontactregistrationdate: {
    //     type: Date,
    //     required: true,
    //     default:null,
    //     index: true
    // },
    // clientcontactpan: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true
    // },
    // clientcontactpandetails: {
    //     type: String,
    //     trim: true,
    //     index: true
    // },
    // clientcontactpanimage: {
    //     type: Object
    // },
    // clientcontactpanremark: {
    //     type: String,
    //     trim: true,
    //     index: true
    // },            
    // clientcontacttan: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true
    // },
    // clientcontacttandetails: {
    //     type: String,
    //     trim: true,
    //     index: true
    // },
    // clientcontacttanimage: {
    //     type: Object
    // },
    // clientcontacttanremark: {
    //     type: String,
    //     trim: true,
    //     index: true
    // },            
    // clientcontacttin: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true
    // },
    // clientcontacttindetails: {
    //     type: String,
    //     trim: true,
    //     index: true
    // },
    // clientcontacttinimage: {
    //     type: Object
    // },
    // clientcontacttinremark: {
    //     type: String,
    //     trim: true,
    //     index: true
    // },            
    // clientcontactgst: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true
    // },
    // clientcontactgstdetails: {
    //     type: String,
    //     trim: true,
    //     index: true
    // },
    // clientcontactgstimage: {
    //     type: Object
    // },
    // clientcontactgstremark: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true
    // },            
    // clientcontactB1nameofdirectors: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB1directorsdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB1directorsimage: {
    //     type: Object
    // },
    // clientcontactB1directorsremask: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB1din: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB1dindetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB1dinimage: {
    //     type: Object
    // },
    // clientcontactB1dinremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },            
    // clientcontactB1pan: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB1pandetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB1panimage: {
    //     type: Object
    // },
    // clientcontactB1panremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },            
    // clientcontactB1aadhaar: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB1aadhaardetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB1aadhaarimage: {
    //     type: Object
    // },
    // clientcontactB1aadhaarremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },            
    // clientcontactB1mobile: {
    //     type: Number,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB1mobiledetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB1mobileremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },        
    // clientcontactB1email: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB1emaildetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB1emailremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },        
    // clientcontactB2nameauthforlisereg: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB2designationauthforlisereg: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB2panauthforlisereg: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB2panauthforliseregdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB2panauthforliseregimage: {
    //     type: Object
    // },
    // clientcontactB2panauthforliseregremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },            
    // clientcontactB2aadhaarauthforlisereg: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },   
    // clientcontactB2aadhaarauthforliseregdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // }, 
    // clientcontactB2aadhaarauthforliseregimage: {
    //     type: Object
    // }, 
    // clientcontactB2aadhaarauthforliseregremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },                      
    // clientcontactB2mobileauthforlisereg: {
    //     type: Number,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB2mobileauthforliseregdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB2mobileauthforliseregremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },        
    // clientcontactB2emailauthforlisereg: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB2emailauthforliseregdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB2emailauthforliseregremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },    
    // clientcontactB2letterauthforlisereg: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB2letterauthforlisereg: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB2letterauthforliseregdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB2letterauthforliseregimage: {
    //     type: Object
    // },
    // clientcontactB2letterauthforliseregremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },                
    // clientcontactB3namecompactvities: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB3namecompactvitiesdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },
    // clientcontactB3namecompactvitiesimage: {
    //     type: Object
    // },
    // clientcontactB3namecompactvitiesremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },            
    // clientcontactB3pancompactvities: {
    //     type: String,
    //     required:true,
    //     trim: true,
    //     index: true,
    // },       
    // clientcontactB3pancompactvitiesdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },  
    // clientcontactB3pancompactvitiesimage: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },  
    // clientcontactB3pancompactvitiesremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },   
    // clientcontactB3aadhaarcompactvities: {
    //     type: String,
    //     required:true,
    //     trim: true,
    //     index: true,
    // },       
    // clientcontactB3aadhaarcompactvitiesdetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },  
    // clientcontactB3aadhaarcompactvitiesimage: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },  
    // clientcontactB3aadhaarcompactvitiesremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // }, 
    // clientcontactB3mobile: {
    //     type: Number,
    //     trim: true,
    //     index: true,
    // },   
    // clientcontactB3mobiledetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // }, 
    // clientcontactB3mobileremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },                   
    // clientcontactB3email: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },   
    // clientcontactB3emaildetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // }, 
    // clientcontactB3emailremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },    
    // clientcontactB3preffered: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },   
    // clientcontactB3preffereddetails: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // }, 
    // clientcontactB3prefferedremark: {
    //     type: String,
    //     trim: true,
    //     index: true,
    // },       
    ClientcontactC1:{
        type:Array,
    },
    ClientcontactC2:{
        type:Array,
    },
    ClientcontactC3:{
        type:Array,
    },
    ClientcontactC4:{
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

const ClientcontactC = mongoose.model('ClientcontactC', clientcontactCSchema)
export default ClientcontactC;