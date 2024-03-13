import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    /***A starts */
    companyname: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    companydetails: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companyimage: {
        type: Object,
    },
    companyremark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companyaddress: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    companystate: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    companydistrict: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    companypin: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    comapnyaddressdetails: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    companyaddressimage: {
        type: Object,
    },
    companyaddressremark: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    companytype: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    companytypedetails: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    companytypeimage: {
        type: Object,
    },
    companytyperemark: {
        type: String,
        default: null,
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
        default: null,
        index: true
    },
    companycategoryimage: {
        type: Object,
    },
    companycategoryremark: {
        type: String,
        trim: true,
        default: null,
        index: true,
    },
    companynatureofbusiness: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    companynatureofbusinessdetails: {
        type: String,
        trim: true,
        default: null,
        index: true,
    },
    companynatureofbusinessimage: {
        type: Object,
    },
    companynatureofbusinessremark: {
        type: String,
        trim: true,
        default: null,
        index: true,
    },
    /***A ends */
    /***B starts */
    companyregistration: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    companyregistrationdetails: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companyregistrationimage: {
        type: Object,
    },
    companyregistrationremark: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    companycin: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    companycindetails: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companyciniamge: {
        type: Object
    },
    companycinremark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companyissuedplace: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    companyissuedplacedetails: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companyissuedplaceimage: {
        type: Object
    },
    companyissuedplaceremark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companyauthority: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    companyauthoritydetails: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companyauthorityimage: {
        type: Object
    },
    companyauthorityremark: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    companypan: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    companypandetails: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companypanimage: {
        type: Object
    },
    companypanremark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companytan: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    companytandetails: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companytanimage: {
        type: Object
    },
    companytanremark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companytin: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    companytindetails: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companytinimage: {
        type: Object
    },
    companytinremark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companygst: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    companygstdetails: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companygstimage: {
        type: Object
    },
    companygstremark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    RegistrationB1: {
        type: Array,
        default: null,
    },
    RegistrationB2: {
        type: Array,
        default: null,
    },
    RegistrationB3: {
        type: Array,
        default: null,
    },
    /***B ends */
    /***C starts */
    ClientcontactC1: {
        type: Array,
    },
    ClientcontactC2: {
        type: Array,
        default: null,
    },
    ClientcontactC3: {
        type: Array,
        default: null,
    },
    ClientcontactC4: {
        type: Array,
        default: null,
    },
    /***C ends */
    /***D starts */
    pfnumber: {
        type: String,
        // required: true,
        default: null,
        trim: true,
        index: true
    },
    pfdetails: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    pfimage: {
        type: Object,
    },
    pfdremark: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    doc: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    pfstate: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    pfdistrict: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    setpfpin: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    pfaddressdetails: {
        type: String,
        trim: true,
        default: null,
        index: true
    },

    pfaddressimage: {
        type: Object
    },
    pfaddressremark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    OtherRegsitrationD1PFsubcodes: {
        type: Array,
    },
    esinumber: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    esidetails: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    esiimage: {
        type: Object
    },
    esidremark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    esidoc: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    esiaddress: {
        type: String,
        trim: true,
        // required: true,
        default: null,
        index: true
    },
    esistate: {
        type: String,
        trim: true,
        // required: true,
        default: null,
        index: true
    },
    esidistrict: {
        type: String,
        trim: true,
        // required: true,
        default: null,
        index: true
    },
    esipin: {
        type: String,
        trim: true,
        // required: true,
        default: null,
        index: true
    },
    esiaddressdetails: {
        type: String,
        trim: true,
        // required: true,
        default: null,
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
        type: Array,
    },
    registrationD3: {
        type: String,
        trim: true,
        // required: true,
        default: null,
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
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    doeregistrationD3: {
        type: Date,
        // required: true,
        default: null,
        index: true
    },
    doddrregistrationD3: {
        type: Date,
        // required: true,
        default: null,
        index: true
    },
    noeD3: {
        type: Number,
        trim: true,
        default: null,
        index: true
    },
    noemD3: {
        type: Number,
        trim: true,
        default: null,
        index: true
    },
    noefD3: {
        type: Number,
        trim: true,
        default: null,
        index: true
    },
    issueauthfD3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    issueauthfD3details: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    issueauthfD3image: {
        type: Object
    },
    issueauthfD3remark: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    fpD3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    fpD3details: {
        type: String,
        defualt: null,
        trim: true,
        index: true
    },
    fpD3image: {
        type: Object
    },
    fpD3remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    doapp: {
        type: Date,
        trim: true,
        default: null,
        index: true
    },
    powerfpD3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    powerfpD3details: {
        type: String,
        defualt: null,
        trim: true,
        index: true
    },
    powerfpD3image: {
        type: Object
    },
    powerfpD3remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    powerhpfpD3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    powerhpfpD3details: {
        type: String,
        defualt: null,
        trim: true,
        index: true
    },
    powerhpfpD3image: {
        type: Object
    },
    powerhpfpD3remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issueauthfpD3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    issueauthfpD3details: {
        type: String,
        defualt: null,
        trim: true,
        index: true
    },
    issueauthfpD3image: {
        type: Object
    },
    issueauthfpD3remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    registrationlwfD3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    registrationlwfD3details: {
        type: String,
        defualt: null,
        trim: true,
        index: true
    },
    registrationlwfD3image: {
        type: Object
    },
    registrationlwfD3remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    doregistrationlwfD3: {
        type: Date,
        trim: true,
        default: null,
        index: true
    },
    registrationptrD3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    registrationptrD3details: {
        type: String,
        defualt: null,
        trim: true,
        index: true
    },
    registrationptrD3image: {
        type: Object
    },
    registrationptrD3remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    doregistrationptrD3: {
        type: Date,
        trim: true,
        default: null,
        index: true
    },
    OtherRegsitrationD3NSP: {
        type: Array,
        default: null,
    },
    OtherRegsitrationD3OTP: {
        type: Array,
        default: null,
    },
    OtherRegsitrationD3WOE: {
        type: Array,
        default: null,
    },
    OtherRegsitrationD3TD: {
        type: Array,
        default: null,
    },
    OtherRegsitrationD3MSME: {
        type: Array,
        default: null,
    },
    OtherRegsitrationD3BOCW: {
        type: Array,
        default: null,
    },
    OtherRegsitrationD3IMW: {
        type: Array,
        default: null,
    },
    OtherRegsitrationD3FL: {
        type: Array,
        default: null,
    },
    /***D ends */
    /***E starts */
    isEngaged: {
        type: Boolean,
        default: false,
        trim: true,
        default: null,
        index: true
    },
    isEngagedDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    isEngagedFile: {
        type: Object,
        default: null
    },
    isEngagedRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contLabRegNoE: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    contLabRegNoEDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contLabRegNoEFile: {
        type: Object,
        default: null
    },
    contLabRegNoERemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    dateOfRegistrationE: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    dateOfRegEDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    dateOfRegEFile: {
        type: Object,
        default: null
    },
    dateOfRegERemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfContractEmployeesE: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    noOfContractEmpEDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfContractEmpEFile: {
        type: Object,
        default: null
    },
    noOfContractEmpERemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfContractorsE: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    noOfContractorsEDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfContractorsEFile: {
        type: Object,
        default: null
    },
    noOfContractorsERemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // -------------- E.1. Details of the Labor Contractotrs---------------------
    nameOfContractorE1: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    nameOfContractorsE1Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    nameOfContractorsE1File: {
        type: Object,
        default: null
    },
    nameOfContractorsE1Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    nameOfEstablishmentE1: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    nameOfEstablishmentE1Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    nameOfEstablishmentE1File: {
        type: Object,
        default: null
    },
    nameOfEstablishmentE1Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regAddContractorE1: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regStateContractorE1: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regDistContractorE1: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regPinContractorE1: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regAddContractorE1Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regAddContractorE1File: {
        type: Object,
        default: null
    },
    regAddContractorE1Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // ----------------- E.2. Agreement Date -----------------------
    agreementExpiryDateE2: {
        type: Date,
        // required: true,
        default: null,
        index: true
    },
    agreementExpiryDateE2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    agreementExpiryDateE2File: {
        type: Object,
        default: null
    },
    agreementExpiryDateE2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    agreementRenewalDateE2: {
        type: Date,
        // required: true,
        index: true,
        default: null,
    },
    agreementRenewalDateE2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    agreementRenewalDateE2DetFile: {
        type: Object,
        default: null
    },
    agreementRenewalDateE2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    natureOfWorkAgreementE2: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    natureOfWorkAgreementE2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    natureOfWorkAgreementE2File: {
        type: Object,
        default: null
    },
    natureOfWorkAgreementE2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfEmpDeployedAgreementE2: {
        type: String,
        // required: true,
        default: null,
        trim: true,
        index: true
    },
    noOfEmpDeployedAgreementE2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfEmpDeployedAgreementE2File: {
        type: Object,
        default: null
    },
    noOfEmpDeployedAgreementE2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // -------------------------- E.3. Contractors Registration Details -------------------------
    companyTypeLabourE3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    companyTypeLabourE3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companyTypeLabourE3File: {
        type: Object,
        default: null
    },
    companyTypeLabourE3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contractLabourLicNoE3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    contractLabourLicNoE3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contractLabourLicNoE3File: {
        type: Object,
        default: null
    },
    contractLabourLicNoE3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contractLicDateE3: {
        type: Date,
        // required: true,
        default: null,
        index: true
    },
    contractLicDateE3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contractLicDateE3File: {
        type: Object,
        default: null
    },
    contractLicDateE3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contractExpiryDateE3: {
        type: Date,
        // required: true,
        default: null,
        index: true
    },
    contractExpiryDateE3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contractExpiryDateE3File: {
        type: Object,
        default: null
    },
    contractExpiryDateE3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contractRenewalDueDateE3: {
        type: Date,
        // required: true,
        default: null,
        index: true
    },
    contractRenewalDueDateE3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contractRenewalDueDateE3File: {
        type: Object,
        default: null
    },
    contractRenewalDueDateE3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfWorkersContractE3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    noOfWorkersContractE3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfWorkersContractE3File: {
        type: Object,
        default: null
    },
    noOfWorkersContractE3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    panContractorsE3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    panContractorsE3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    panContractorsE3File: {
        type: Object,
        default: null
    },
    panContractorsE3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    gstContractorsE3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    gstContractorsE3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    gstContractorsE3File: {
        type: Object,
        default: null
    },
    gstContractorsE3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    pfRegContractorsE3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    pfRegContractorsE3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    pfRegContractorsE3File: {
        type: Object,
        default: null
    },
    pfRegContractorsE3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    esicRegContractorsE3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    esicRegContractorsE3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    esicRegContractorsE3File: {
        type: Object,
        default: null
    },
    esicRegContractorsE3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    shopsandEstContractorsE3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    shopsandEstContractorsE3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    shopsandEstContractorsE3File: {
        type: Object,
        default: null
    },
    shopsandEstContractorsE3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    lwfRegContractorsE3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    lwfRegContractorsE3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    lwfRegContractorsE3File: {
        type: Object,
        default: null
    },
    lwfRegContractorsE3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    profTaxContractorsE3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    profTaxContractorsE3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    profTaxContractorsE3File: {
        type: Object,
        default: null
    },
    profTaxContractorsE3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    /***E ends */
    /***F starts */
    noOfBranchesF: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    branchFDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    branchFFile: {
        type: Object,
        default: null
    },
    branchFRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    branchNameF: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    branchNameFDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    branchNameFFile: {
        type: Object,
        default: null
    },
    branchNameFRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    isFactorySEF: {
        type: Boolean,
        default: false,
        index: true
    },
    isFactorySEFDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    isFactorySEFFile: {
        type: Object,
        default: null
    },
    isFactorySEFRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contractorAddBranchF: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    contractorStateBranchF: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    contractorDistBranchF: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    contractorPinBranchF: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    contractorAddBranchFDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contractorAddBranchFFile: {
        type: Object,
        default: null
    },
    contractorAddBranchFRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    branchOpeningDateF: {
        type: Date,
        // required: true,
        default: null,
        index: true
    },
    branchOpeningDateFDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    branchOpeningDateFFile: {
        type: Object,
        default: null
    },
    branchOpeningDateFRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfEmpBranchF: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    noOfEmpBranchFDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfEmpBranchFFile: {
        type: Object,
        default: null
    },
    noOfEmpBranchFRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // ---------------------- F.1. Manager Details --------------------

    managerNameF1: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    managerNameF1Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    managerNameF1File: {
        type: Object,
        default: null
    },
    managerNameF1Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    managerMobNoF1: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    managerMobNoF1Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    managerMobNoF1File: {
        type: Object,
        default: null
    },
    managerMobNoF1Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    managerEmailF1: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    managerEmailF1Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    managerEmailF1File: {
        type: Object,
        default: null
    },
    managerEmailF1Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    managerAadharNoF1: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    managerAadharNoF1Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    managerAadharNoF1File: {
        type: Object,
        default: null
    },
    managerAadharNoF1Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    managerPanF1: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    managerPanF1Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    managerPanF1File: {
        type: Object,
        default: null
    },
    managerPanF1Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // ------------------- F.2. Details of Registration & Licenses ------------------------
    shopsEstLicenseF2: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    shopsEstLicenseF2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    shopsEstLicenseF2File: {
        type: Object,
        default: null
    },
    shopsEstLicenseF2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    numberF2: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    numberF2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    numberF2File: {
        type: Object,
        default: null
    },
    numberF2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDateF2: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    regDateF2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDateF2File: {
        type: Object,
        default: null
    },
    regDateF2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    expiryDateF2: {
        type: Date,
        // required: true,
        default: null,
        index: true,
    },
    expiryDateF2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    expiryDateF2File: {
        type: Object,
        default: null
    },
    expiryDateF2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    renewalDateF2: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    renewalDateF2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    renewalDateF2File: {
        type: Object,
        default: null
    },
    renewalDateF2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    managerNameF2: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    managerNameF2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    managerNameF2File: {
        type: Object,
        default: null
    },
    managerNameF2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfEmployeesF2: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    noOfEmployeesF2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfEmployeesF2File: {
        type: Object,
        default: null
    },
    noOfEmployeesF2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    maleF2: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    maleF2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    maleF2File: {
        type: Object,
        default: null
    },
    maleF2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    femaleF2: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    femaleF2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    femaleF2File: {
        type: Object,
        default: null
    },
    femaleF2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthorityF2: {
        type: String,
        // required: true,
        default: null,
        trim: true,
        index: true,
    },
    issuingAuthorityF2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthorityF2File: {
        type: Object,
        default: null
    },
    issuingAuthorityF2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // -------------------- F.3. Factory License ----------------------
    numberF3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    numberF3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    numberF3File: {
        type: Object,
        default: null
    },
    numberF3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDateF3: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    regDateF3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDateF3File: {
        type: Object,
        default: null
    },
    regDateF3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    expiryDateF3: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    expiryDateF3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    expiryDateF3File: {
        type: Object,
        default: null
    },
    expiryDateF3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    renewalDateF3: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    renewalDateF3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    renewalDateF3File: {
        type: Object,
        default: null
    },
    renewalDateF3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    managerNameF3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    managerNameF3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    managerNameF3File: {
        type: Object,
        default: null
    },
    managerNameF3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfEmployeesF3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    noOfEmployeesF3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfEmployeesF3File: {
        type: Object,
        default: null
    },
    noOfEmployeesF3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    maleF3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    maleF3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    maleF3File: {
        type: Object,
        default: null
    },
    maleF3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    femaleF3: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    femaleF3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    femaleF3File: {
        type: Object,
        default: null
    },
    femaleF3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthorityF3: {
        type: String,
        // required: true,
        default: null,
        trim: true,
        index: true,
    },
    issuingAuthorityF3Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthorityF3File: {
        type: Object,
        default: null
    },
    issuingAuthorityF3Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // --------------------- F.4. Factory Plan ----------------------
    numberF4: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    numberF4Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    numberF4File: {
        type: Object,
        default: null
    },
    numberF4Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDateF4: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    regDateF4Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDateF4File: {
        type: Object,
        default: null
    },
    regDateF4Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthorityF4: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    issuingAuthorityF4Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthorityF4File: {
        type: Object,
        default: null
    },
    issuingAuthorityF4Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // --------------------- F.5. Details of Contract Labour ----------------
    numberF5: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    numberF5Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    numberF5File: {
        type: Object,
        default: null
    },
    numberF5Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDateF5: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    regDateF5Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDateF5File: {
        type: Object,
        default: null
    },
    regDateF5Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthorityF5: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    issuingAuthorityF5Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthorityF5File: {
        type: Object,
        default: null
    },
    issuingAuthorityF5Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // ------------------------ F.5. Details of the Labor Contractors --------------
    isContractLabourEngagedF5: {
        type: Boolean,
        default: false,
        trim: true,
        default: null,
        index: true,
    },
    contractLabRegNoF5: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    contractLabRegNoF5Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contractLabRegNoF5File: {
        type: Object,
        default: null
    },
    contractLabRegNoF5Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDateContractorF5: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    regDateContractorF5Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDateContractorF5File: {
        type: Object,
        default: null
    },
    regDateContractorF5Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfContractEmpF5: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    noOfContractEmpF5Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfContractEmpF5File: {
        type: Object,
        default: null
    },
    noOfContractEmpF5Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfContractorsF5: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    noOfContractorsF5Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfContractorsF5File: {
        type: Object,
        default: null
    },
    noOfContractorsF5Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // ----------------- F.5.1. Details of the Labor Contractors --------------
    contractorNameF51: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    contractorNameF51Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contractorNameF51File: {
        type: Object,
        default: null
    },
    contractorNameF51Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    establishmentNameF51: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    establishmentNameF51Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    establishmentNameF51File: {
        type: Object,
        default: null
    },
    establishmentNameF51Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regAddContractorF51: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regStateContractorF51: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regDistContractorF51: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regPinContractorF51: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regAddContractorF51Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regAddContractorF51File: {
        type: Object,
        default: null
    },
    regAddContractorF51Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // ------------- F.5.2. Agreement Date -----------------------
    expiryDateF52: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    expiryDateF52Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    expiryDateF52File: {
        type: Object,
        default: null
    },
    expiryDateF52Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    renewalDateF52: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    renewalDateF52Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    renewalDateF52File: {
        type: Object,
        default: null
    },
    renewalDateF52Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    natureOfWorkF52: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    natureOfWorkF52Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    natureOfWorkF52File: {
        type: Object,
        default: null
    },
    natureOfWorkF52Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfEmpDeployedF52: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    noOfEmpDeployedF52Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfEmpDeployedF52File: {
        type: Object,
        default: null
    },
    noOfEmpDeployedF52Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // ---------------------- F.5.3. Contractors Registration Details --------------
    companyTypeF53: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    companyTypeF53Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    companyTypeF53File: {
        type: Object,
        default: null
    },
    companyTypeF53Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contractLabLicNoF53: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    contractLabLicNoF53Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contractLabLicNoF53File: {
        type: Object,
        default: null
    },
    contractLabLicNoF53Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    licenseDateF53: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    licenseDateF53Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    licenseDateF53File: {
        type: Object,
        default: null
    },
    licenseDateF53Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    expiryDateF53: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    expiryDateF53Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    expiryDateF53File: {
        type: Object,
        default: null
    },
    expiryDateF53Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    renewalDateF53: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    renewalDateF53Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    renewalDateF53File: {
        type: Object,
        default: null
    },
    renewalDateF53Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfWorkerF53: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    noOfWorkerF53Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfWorkerF53File: {
        type: Object,
        default: null
    },
    noOfWorkerF53Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    panF53: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    panF53Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    panF53File: {
        type: Object,
        default: null
    },
    panF53Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    gstF53: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    gstF53Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    gstF53File: {
        type: Object,
        default: null
    },
    gstF53Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    pfRegF53: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    pfRegF53Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    pfRegF53File: {
        type: Object,
        default: null
    },
    pfRegF53Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    esicRegF53: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    esicRegF53Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    esicRegF53File: {
        type: Object,
        default: null
    },
    esicRegF53Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    shopsEstF53: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    shopsEstF53Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    shopsEstF53File: {
        type: Object,
        default: null
    },
    shopsEstF53Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    lwfRegF53: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    lwfRegF53Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    lwfRegF53File: {
        type: Object,
        default: null
    },
    lwfRegF53Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    profTaxF53: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    profTaxF53Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    profTaxF53File: {
        type: Object,
        default: null
    },
    profTaxF53Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // --------------- F.5.4 Night Shift Permission --------------------
    number54: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    number54Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    number54File: {
        type: Object,
        default: null
    },
    number54Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDate54: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    regDate54Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDate54File: {
        type: Object,
        default: null
    },
    regDate54Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    expiryDate54: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    expiryDate54Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    expiryDate54File: {
        type: Object,
        default: null
    },
    expiryDate54Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    renewalDate54: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    renewalDate54Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    renewalDate54File: {
        type: Object,
        default: null
    },
    renewalDate54Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthority54: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    issuingAuthority54Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthority54File: {
        type: Object,
        default: null
    },
    issuingAuthority54Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // ----------------- F.5.5 OT Permission ----------------
    number55: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    number55Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    number55File: {
        type: Object,
        default: null
    },
    number55Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDate55: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    regDate55Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDate55File: {
        type: Object,
        default: null
    },
    regDate55Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    expiryDate55: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    expiryDate55Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    expiryDate55File: {
        type: Object,
        default: null
    },
    expiryDate55Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    renewalDate55: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    renewalDate55Det: {
        type: Date,
        trim: true,
        default: null,
        index: true
    },
    renewalDate55File: {
        type: Object,
        default: null
    },
    renewalDate55Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthoritye55: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    issuingAuthoritye55Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthoritye55File: {
        type: Object,
        default: null
    },
    issuingAuthoritye55Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // ---------------- F.5.6 Weekly Off Exemption --------------

    number56: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    number56Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    number56File: {
        type: Object,
        default: null
    },
    number56Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDate56: {
        type: Date,
        //// required: true,
        trim: true,
        index: true,
    },
    regDate56Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDate56File: {
        type: Object,
        default: null
    },
    regDate56Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    expiryDate56: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    expiryDate56Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    expiryDate56File: {
        type: Object,
        default: null
    },
    expiryDate56Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    renewalDate56: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    renewalDate56Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    renewalDate56File: {
        type: Object,
        default: null
    },
    renewalDate56Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthority56: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    issuingAuthority56Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthority56File: {
        type: Object,
        default: null
    },
    issuingAuthority56Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // -------------------- F.5.7 Trade License -------------------------
    number57: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    number57Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    number57File: {
        type: Object,
        default: null
    },
    number57Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDate57: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    regDate57Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regDate57File: {
        type: Object,
        default: null
    },
    regDate57Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    expiryDate57: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    expiryDate57Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    expiryDate57File: {
        type: Object,
        default: null
    },
    expiryDate57Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    renewalDate57: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    renewalDate57Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    renewalDate57File: {
        type: Object,
        default: null
    },
    renewalDate57Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthority57: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    issuingAuthority57Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    issuingAuthority57File: {
        type: Object,
        default: null
    },
    issuingAuthority57Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    /***F ends */
    /***G starts */
    isLabourEngagedG: {
        type: Boolean,
        default: false,
        index: true,
        default: null,
    },
    isLabourEngagedGDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    isLabourEngagedGFile: {
        type: Object,
        default: null
    },
    isLabourEngagedGRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfClientG: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    noOfClientGDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfClientGFile: {
        type: Object,
        default: null
    },
    noOfClientGRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clientG: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    clientGDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clientGFile: {
        type: Object,
        default: null
    },
    clientGRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regOfficeAddClientG: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regOfficeStateClientG: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regOfficeDistClientG: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regOfficePinClientG: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regOfficeAddClientGDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regOfficeAddClientGFile: {
        type: Object,
        default: null
    },
    regOfficeAddClientGRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // client2: {
    //     type: Date,
    //     // required: true,
    //     trim : true,
    //     index: true,
    // },
    // client2Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
    // client2File: {
    //     type: Object,
    //     default: null
    // },
    // client2Remark: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
    // regOfficeAddClient2: {
    //     address: {
    //         type: String,
    //        // required: true,
    //         trim: true,
    //         index: true
    //     },
    //     state: {
    //         type: String,
    //        // required: true,
    //         trim: true,
    //         index: true
    //     },
    //     district: {
    //         type: String,
    //        // required: true,
    //         trim: true,
    //         index: true
    //     },
    //     pincode: {
    //         type: String,
    //        // required: true,
    //         trim: true,
    //         index: true
    //     }
    // },
    // regOfficeAddClient2Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
    // regOfficeAddClient2File: {
    //     type: Object,
    //     default: null
    // },
    // regOfficeAddClient2Remark: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
    // ------------------- G.1.1. Details of the Contract Work -----------------

    noOfLocContractWorkG11: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    noOfLocContractWorkG11Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfLocContractWorkG11File: {
        type: Object,
        default: null
    },
    noOfLocContractWorkG11Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regAddOfClientG11: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regStateOfClientG11: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regDistOfClientG11: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regPinOfClientG11: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true
    },
    regAddOfClientG11Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regAddOfClientG11File: {
        type: Object,
        default: null
    },
    regAddOfClientG11Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // ---------------- G.1.2. Nature of the Contract Work ----------------
    agreementRefNoG12: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    agreementRefNoG12Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    agreementRefNoG12File: {
        type: Object,
        default: null
    },
    agreementRefNoG12Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    agreementDateG12: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    agreementDateG12Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    agreementDateG12File: {
        type: Object,
        default: null
    },
    agreementDateG12Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    agreementValidityG12: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    agreementValidityG12Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    agreementValidityG12File: {
        type: Object,
        default: null
    },
    agreementValidityG12Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfWorkersEngagedG12: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    noOfWorkersEngagedG12Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfWorkersEngagedG12File: {
        type: Object,
        default: null
    },
    noOfWorkersEngagedG12Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    estCategoryG12: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    estCategoryG12Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    estCategoryG12File: {
        type: Object,
        default: null
    },
    estCategoryG12Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    isClraApplicableG12: {
        type: Boolean,
        default: false,
        index: true,
    },
    // ----------------- G.1.3. Details of CLRA License -------------------
    noOfForm5G13: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    noOfForm5G13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfForm5G13File: {
        type: Object,
        default: null
    },
    noOfForm5G13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    form5DateG13: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    form5DateG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    form5DateG13File: {
        type: Object,
        default: null
    },
    form5DateG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    workCommencedDateG13: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    workCommencedDateG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    workCommencedDateG13File: {
        type: Object,
        default: null
    },
    workCommencedDateG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraLicenseNoG13: {
        type: String,
        // required: true,
        trim: true,
        index: true,
        default: null,
    },
    clraLicenseNoG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraLicenseNoG13File: {
        type: Object,
        default: null
    },
    clraLicenseNoG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraLicenseDateG13: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    clraLicenseDateG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraLicenseDateG13File: {
        type: Object,
        default: null
    },
    clraLicenseDateG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraValidityG13: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    clraValidityG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraValidityG13File: {
        type: Object,
        default: null
    },
    clraValidityG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraRenewalDueG13: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    clraRenewalDueG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraRenewalDueG13File: {
        type: Object,
        default: null
    },
    clraRenewalDueG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraNoOfContWorkersG13: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    clraNoOfContWorkersG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraNoOfContWorkersG13File: {
        type: Object,
        default: null
    },
    clraNoOfContWorkersG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraNoOfManagerRespG13: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    clraNoOfManagerRespG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraNoOfManagerRespG13File: {
        type: Object,
        default: null
    },
    clraNoOfManagerRespG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraLicenseFeeG13: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    clraLicenseFeeG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraLicenseFeeG13File: {
        type: Object,
        default: null
    },
    clraLicenseFeeG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    securityDepositG13: {
        type: String,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    securityDepositG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    securityDepositG13File: {
        type: Object,
        default: null
    },
    securityDepositG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // ------------------ G.1.4. Details of the Completion of the Contract ----------
    contWorkCompletedDate: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    contWorkCompletedDateDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contWorkCompletedDateFile: {
        type: Object,
        default: null
    },
    contWorkCompletedDateRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contWorkComplitionNotice: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    contWorkComplitionNoticeDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contWorkComplitionNoticeFile: {
        type: Object,
        default: null
    },
    contWorkComplitionNoticeRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    refundSecDepNotice: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    refundSecDepNoticeDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    refundSecDepNoticeFile: {
        type: Object,
        default: null
    },
    refundSecDepNoticeRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    licSurrenderedDate: {
        type: Date,
        // required: true,
        trim: true,
        default: null,
        index: true,
    },
    licSurrenderedDateDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    licSurrenderedDateFile: {
        type: Object,
        default: null
    },
    licSurrenderedDateRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    /***G ends */
    status: {
        type: Number,
        index: true,
        default: 0
    },
    created_at: {
        type: Date,
        default: null,
        index: true
    },
    updated_at: {
        type: Date,
        default: null,
    }
})
const Companydata = mongoose.model("Companydata", companySchema)
export default Companydata;