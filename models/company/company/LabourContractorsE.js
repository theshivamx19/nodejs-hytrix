import mongoose from 'mongoose'

// --------------- E. Details of the labour contractors ------------------

const labourContractorSchema = new mongoose.Schema({
    isEngaged: {
        type: Boolean,
        default: false,
        trim: true,
        index: true
    },
    isEngagedDet: {
        type: String,
        trim: true,
        index: true
    },
    isEngagedFile: {
        type: Object,
        default: null
    },
    isEngagedRemark: {
        type: String,
        trim: true,
        index: true
    },
    contLabRegNoE: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    contLabRegNoEDet: {
        type: String,
        trim: true,
        index: true
    },
    contLabRegNoEFile: {
        type: Object,
        default: null
    },
    contLabRegNoERemark: {
        type: String,
        trim: true,
        index: true
    },
    dateOfRegistrationE: {
        type: Date,
        required: true,
        trim: true,
        index: true
    },
    dateOfRegEDet: {
        type: String,
        trim: true,
        index: true
    },
    dateOfRegEFile: {
        type: Object,
        default: null
    },
    dateOfRegERemark: {
        type: String,
        trim: true,
        index: true
    },
    noOfContractEmployeesE: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    noOfContractEmpEDet: {
        type: String,
        trim: true,
        index: true
    },
    noOfContractEmpEFile: {
        type: Object,
        default: null
    },
    noOfContractEmpERemark: {
        type: String,
        trim: true,
        index: true
    },
    noOfContractorsE: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    noOfContractorsEDet: {
        type: String,
        trim: true,
        index: true
    },
    noOfContractorsEFile: {
        type: Object,
        default: null
    },
    noOfContractorsERemark: {
        type: String,
        trim: true,
        index: true
    },
    // -------------- E.1. Details of the Labor Contractotrs---------------------
    nameOfContractorE1: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    nameOfContractorsE1Det: {
        type: String,
        trim: true,
        index: true
    },
    nameOfContractorsE1File: {
        type: Object,
        default: null
    },
    nameOfContractorsE1Remark: {
        type: String,
        trim: true,
        index: true
    },
    nameOfEstablishmentE1: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    nameOfEstablishmentE1Det: {
        type: String,
        trim: true,
        index: true
    },
    nameOfEstablishmentE1File: {
        type: Object,
        default: null
    },
    nameOfEstablishmentE1Remark: {
        type: String,
        trim: true,
        index: true
    },
    regAddContractorE1: {
        address: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        state: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        district: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        pincode: {
            type: String,
            required: true,
            trim: true,
            index: true
        }
    },
    regAddContractorE1Det: {
        type: String,
        trim: true,
        index: true
    },
    regAddContractorE1File: {
        type: Object,
        default: null
    },
    regAddContractorE1Remark: {
        type: String,
        trim: true,
        index: true
    },
    // ----------------- E.2. Agreement Date -----------------------
    agreementExpiryDateE2: {
        type: Date,
        required: true,
        index: true
    },
    agreementExpiryDateE2Det: {
        type: String,
        trim: true,
        index: true
    },
    agreementExpiryDateE2File: {
        type: Object,
        default: null
    },
    agreementExpiryDateE2Remark: {
        type: String,
        trim: true,
        index: true
    },
    agreementRenewalDateE2: {
        type: Date,
        required: true,
        index: true
    },
    agreementRenewalDateE2Det: {
        type: String,
        trim: true,
        index: true
    },
    agreementRenewalDateE2DetFile: {
        type: Object,
        default: null
    },
    agreementRenewalDateE2Remark: {
        type: String,
        trim: true,
        index: true
    },
    natureOfWorkAgreementE2: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    natureOfWorkAgreementE2Det: {
        type: String,
        trim: true,
        index: true
    },
    natureOfWorkAgreementE2File: {
        type: Object,
        default: null
    },
    natureOfWorkAgreementE2Remark: {
        type: String,
        trim: true,
        index: true
    },
    noOfEmpDeployedAgreementE2: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    noOfEmpDeployedAgreementE2Det: {
        type: String,
        trim: true,
        index: true
    },
    noOfEmpDeployedAgreementE2File: {
        type: Object,
        default: null
    },
    noOfEmpDeployedAgreementE2Remark: {
        type: String,
        trim: true,
        index: true
    },
    // -------------------------- E.3. Contractors Registration Details -------------------------
    companyTypeLabourE3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    companyTypeLabourE3Det: {
        type: String,
        trim: true,
        index: true
    },
    companyTypeLabourE3File: {
        type: Object,
        default: null
    },
    companyTypeLabourE3Remark: {
        type: String,
        trim: true,
        index: true
    },
    contractLabourLicNoE3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    contractLabourLicNoE3Det: {
        type: String,
        trim: true,
        index: true
    },
    contractLabourLicNoE3File: {
        type: Object,
        default: null
    },
    contractLabourLicNoE3Remark: {
        type: String,
        trim: true,
        index: true
    },
    contractLicDateE3: {
        type: Date,
        required: true,
        index: true
    },
    contractLicDateE3Det: {
        type: String,
        trim: true,
        index: true
    },
    contractLicDateE3File: {
        type: Object,
        default: null
    },
    contractLicDateE3Remark: {
        type: String,
        trim: true,
        index: true
    },
    contractExpiryDateE3: {
        type: Date,
        required: true,
        index: true
    },
    contractExpiryDateE3Det: {
        type: String,
        trim: true,
        index: true
    },
    contractExpiryDateE3File: {
        type: Object,
        default: null
    },
    contractExpiryDateE3Remark: {
        type: String,
        trim: true,
        index: true
    },
    contractRenewalDueDateE3: {
        type: Date,
        required: true,
        index: true
    },
    contractRenewalDueDateE3Det: {
        type: String,
        trim: true,
        index: true
    },
    contractRenewalDueDateE3File: {
        type: Object,
        default: null
    },
    contractRenewalDueDateE3Remark: {
        type: String,
        trim: true,
        index: true
    },
    noOfWorkersContractE3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    noOfWorkersContractE3Det: {
        type: String,
        trim: true,
        index: true
    },
    noOfWorkersContractE3File: {
        type: Object,
        default: null
    },
    noOfWorkersContractE3Remark: {
        type: String,
        trim: true,
        index: true
    },
    panContractorsE3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    panContractorsE3Det: {
        type: String,
        trim: true,
        index: true
    },
    panContractorsE3File: {
        type: Object,
        default: null
    },
    panContractorsE3Remark: {
        type: String,
        trim: true,
        index: true
    },
    gstContractorsE3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    gstContractorsE3Det: {
        type: String,
        trim: true,
        index: true
    },
    gstContractorsE3File: {
        type: Object,
        default: null
    },
    gstContractorsE3Remark: {
        type: String,
        trim: true,
        index: true
    },
    pfRegContractorsE3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    pfRegContractorsE3Det: {
        type: String,
        trim: true,
        index: true
    },
    pfRegContractorsE3File: {
        type: Object,
        default: null
    },
    pfRegContractorsE3Remark: {
        type: String,
        trim: true,
        index: true
    },
    esicRegContractorsE3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    esicRegContractorsE3Det: {
        type: String,
        trim: true,
        index: true
    },
    esicRegContractorsE3File: {
        type: Object,
        default: null
    },
    esicRegContractorsE3Remark: {
        type: String,
        trim: true,
        index: true
    },
    shopsandEstContractorsE3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    shopsandEstContractorsE3Det: {
        type: String,
        trim: true,
        index: true
    },
    shopsandEstContractorsE3File: {
        type: Object,
        default: null
    },
    shopsandEstContractorsE3Remark: {
        type: String,
        trim: true,
        index: true
    },
    lwfRegContractorsE3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    lwfRegContractorsE3Det: {
        type: String,
        trim: true,
        index: true
    },
    lwfRegContractorsE3File: {
        type: Object,
        default: null
    },
    lwfRegContractorsE3Remark: {
        type: String,
        trim: true,
        index: true
    },
    profTaxContractorsE3: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    profTaxContractorsE3Det: {
        type: String,
        trim: true,
        index: true
    },
    profTaxContractorsE3File: {
        type: Object,
        default: null
    },
    profTaxContractorsE3Remark: {
        type: String,
        trim: true,
        index: true
    },
    status: {
        type: Number,
        default: 0,
        index: true
    }
},

    { timestamps: true })

const Labourcontractor = mongoose.model('Labourcontractor', labourContractorSchema)
export default Labourcontractor