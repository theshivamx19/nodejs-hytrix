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

        trim: true,
        default: null,
        index: true
    },
    companystate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State"
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    companydistrict: {
        type: String,

        trim: true,
        default: null,
        index: true
    },
    companypin: {
        type: String,

        trim: true,
        default: null,
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

        default: null,
        trim: true,
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

        trim: true,
        default: null,
        index: true
    },
    pfstate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State"
    },
    pfdistrict: {
        type: String,

        trim: true,
        default: null,
        index: true
    },
    setpfpin: {
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

        trim: true,
        default: null,
        index: true
    },
    esiaddress: {
        type: String,
        trim: true,

        default: null,
        index: true
    },
    esistate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State"
    },
    esidistrict: {
        type: String,
        trim: true,

        default: null,
        index: true
    },
    esipin: {
        type: String,
        trim: true,

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

        trim: true,
        default: null,
        index: true
    },
    doeregistrationD3: {
        type: Date,

        default: null,
        index: true
    },
    doddrregistrationD3: {
        type: Date,

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

        trim: true,
        default: null,
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

        trim: true,
        default: null,
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

        trim: true,
        default: null,
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

        trim: true,
        default: null,
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

        trim: true,
        default: null,
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

        trim: true,
        default: null,
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

        trim: true,
        default: null,
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
    /***D ends */
    /***E starts */
    isEngaged: {
        type: Boolean,
        default: false,
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

        trim: true,
        default: null,
        index: true
    },
    regStateContractorE1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State"
    },
    regDistContractorE1: {
        type: String,

        trim: true,
        default: null,
        index: true
    },
    regPinContractorE1: {
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
    // agreementExpiryDateE2Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // agreementRenewalDateE2Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // natureOfWorkAgreementE2Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // noOfEmpDeployedAgreementE2Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // companyTypeLabourE3Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // contractLabourLicNoE3Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // contractLicDateE3Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // contractExpiryDateE3Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // contractRenewalDueDateE3Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // noOfWorkersContractE3Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // panContractorsE3Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // gstContractorsE3Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // pfRegContractorsE3Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // esicRegContractorsE3Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // shopsandEstContractorsE3Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // lwfRegContractorsE3Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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
    // profTaxContractorsE3Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
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

    contractorAddBranchF: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    contractorStateBranchF: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    contractorDistBranchF: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    contractorPinBranchF: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // contractorAddBranchFDet: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    contractorAddBranchFRemark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    branchOpeningDateF: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    noOfEmpBranchF: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    managerNameF1: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // managerNameF1Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    managerNameF1Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    managerMobNoF1: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // managerMobNoF1Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    managerMobNoF1Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    managerEmailF1: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // managerEmailF1Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    managerEmailF1Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    managerAadharNoF1: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // managerAadharNoF1Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    managerAadharNoF1Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    managerPanF1: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // managerPanF1Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    managerPanF1Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    shopsEstLicenseF2: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // shopsEstLicenseF2Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    shopsEstLicenseF2Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    contractLabRegNoF5: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // contractLabRegNoF5Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    contractLabRegNoF5Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    regDateContractorF5: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    coOfContractEmpF5: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    noOfContractorsF5: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    contractorNameF51: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // contractorNameF51Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    contractorNameF51Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    establishmentNameF51: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // establishmentNameF51Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    establishmentNameF51Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    regisocontractaddress: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    regisocontractstate: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    regisocontractdistrict: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    regisocontractpin: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // regAddContractorF51Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    regAddContractorF51Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    expiryDateF52: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    renewalDateF52: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    natureOfWorkF52: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // natureOfWorkF52Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    natureOfWorkF52Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    noOfEmpDeployedF52: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // companyTypeF53Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    companyTypeF53Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    contractLabLicNoF53: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // contractLabLicNoF53Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    contractLabLicNoF53Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    licenseDateF53: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    expiryDateF53: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    renewalDateF53: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    noOfWorkerF53: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    panF53: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // panF53Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    panF53Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    gstF53: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // gstF53Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    gstF53Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    pfRegF53: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // pfRegF53Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    pfRegF53Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    esicRegF53: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // esicRegF53Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    esicRegF53Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    shopsEstF53: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // shopsEstF53Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    shopsEstF53Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    lwfRegF53: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // lwfRegF53Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    lwfRegF53Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    profTaxF53: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // profTaxF53Det: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    profTaxF53Remark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    //  F files
    contractorAddBranchFFile: {
        type: Object,
        default: null
    },
    managerNameF1File: {
        type: Object,
        default: null
    },
    managerAadharNoF1File: {
        type: Object,
        default: null
    },
    managerPanF1File: {
        type: Object,
        default: null
    },
    shopsEstLicenseF2File: {
        type: Object,
        default: null
    },
    contractLabRegNoF5File: {
        type: Object,
        default: null
    },
    contractorNameF51File: {
        type: Object,
        default: null
    },
    establishmentNameF51File: {
        type: Object,
        default: null
    },
    regAddContractorF51File: {
        type: Object,
        default: null
    },
    natureOfWorkF52File: {
        type: Object,
        default: null
    },
    companyTypeF53File: {
        type: Object,
        default: null
    },
    contractLabLicNoF53File: {
        type: Object,
        default: null
    },
    panF53File: {
        type: Object,
        default: null
    },
    gstF53File: {
        type: Object,
        default: null
    },
    pfRegF53File: {
        type: Object,
        default: null
    },
    esicRegF53File: {
        type: Object,
        default: null
    },
    shopsEstF53File: {
        type: Object,
        default: null
    },
    lwfRegF53File: {
        type: Object,
        default: null
    },
    profTaxF53File: {
        type: Object,
        default: null
    },
    // --------- Dynamic array data
    F1branch: {
        type: Array,
        default: null
    },
    F1RLicense: {
        type: Array,
        default: null
    },
    F1FL: {
        type: Array,
        default: null
    },
    F1FP: {
        type: Array,
        default: null
    },
    F54NSP: {
        type: Array,
        default: null
    },
    F54OTP: {
        type: Array,
        default: null
    },
    F54WOE: {
        type: Array,
        default: null
    },
    F54TL: {
        type: Array,
        default: null
    },

    /***F ends */
    /***G starts */

    g12ncw: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // g12ncwdet: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    g12ncwremark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g12ncwdate: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g12ncwdatevalid: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g12ncwnow: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g12ncwcoe: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // g12ncwcoedet: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    g12ncwcoeremark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g13form: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // g13formdet: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    g13formremark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g13form5date: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g13form5dateofcommence: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g13form5licenece: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // g13form5licenecedet: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    g13form5liceneceremark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g13form5licensedol: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g13form5licensedolvalid: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g13form5licensedoldor: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g13form5licenseworkers: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g13form5licensemanresp: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g13form5licensefee: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // g13form5licensefeedet: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    g13form5licensefeeremark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g13form5securityfee: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    // g13form5securityfeedet: {
    //     type: String,
    //     default: null,
    //     trim: true,
    //     index: true,
    // },
    g13form5securityfeeremark: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g14dcwc: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g14dncc: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g14dars: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g14dls: {
        type: String,
        default: null,
        trim: true,
        index: true,
    },
    g12ncwimage: {
        type: Object,
        default: null
    },
    g12ncwcoeimage: {
        type: Object,
        default: null
    },
    g13formimage: {
        type: Object,
        default: null
    },
    g13form5liceneceimage: {
        type: Object,
        default: null
    },
    g13form5licensefeeimage: {
        type: Object,
        default: null
    },
    g13form5securityfeeimage: {
        type: Object,
        default: null
    },
    GCC4TL: {
        type: Array,
        default: null
    },

    g12ncwimage: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    g12ncwcoeimage: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    g13formimage: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    g13form5liceneceimage: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    g13form5licensefeeimage: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    g13form5securityfeeimage: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    /***G ends */
    reason: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    approveDate: {
        type: Date,
        default: null,
        index: true
    },
    license: {
        type: String,
        default: null,
        trim: true,
        index: true
    },
    receivedDate: {
        type: Date,
        default: null,
        index: true
    },
    compActInActStatus: {
        type: Number,
        index: true,
        default: 0
    },
    compIntractStatus: {
        type: Number,
        index: true,
        default: 0
    },
    inactiveDate: {
        type: Date,
        default: null,
        index: true
    },
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
    },
    rejected_at: {
        type: Date,
        default: null,
    },
// ------------------ some new fields added --------------------
    issuingauthremark: {
        type : String,
        default : null,
        trim : true,
        index : true
    },
    issuingauthimage: {
        type : String,
        default : null,
        trim : true,
        index : true
    },
    issuingauth: {
        type : String,
        default : null,
        trim : true,
        index : true
    },
    nof: {
        type : String,
        default : null,
        trim : true,
        index : true
    },
    nom: {
        type : String,
        default : null,
        trim : true,
        index : true
    },
    noe: {
        type : String,
        default : null,
        trim : true,
        index : true
    },
    managerlicenseremark: {
        type : String,
        default : null,
        trim : true,
        index : true
    },
    managerlicenseimage : {
        type : String,
        default : null,
        trim : true,
        index : true
    },
    managernamelicense: {
        type : String,
        default : null,
        trim : true,
        index : true
    },
    doddr: {
        type : String,
        default : null,
        trim : true,
        index : true
    },
    doe: {
        type : String,
        default : null,
        trim : true,
        index : true
    },
    dor: {
        type : String,
        default : null,
        trim : true,
        index : true
    },
    licensenumber: {
        type : String,
        default : null,
        trim : true,
        index : true
    },
    licensenumberimage: {
        type : String,
        default : null,
        trim : true,
        index : true
    },
    licensenumberremark: {
        type : String,
        default : null,
        trim : true,
        index : true
    },
})
const Companydata = mongoose.model("Companydata", companySchema)
export default Companydata;
