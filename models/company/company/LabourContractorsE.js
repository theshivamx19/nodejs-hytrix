import mongoose from 'mongoose'

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
        type: Object
    },
    isEngagedRemark: {
        type: String,
        trim: true,
        index: true
    },
    dateOfRegistration: {
        type: Date,
        required: true,
        trim: true,
        index: true
    },
    dateOfRegDet: {
        type: String,
        trim: true,
        index: true
    },
    dateOfRegFile: {
        type: Object
    },
    dateOfRegRemark: {
        type: String,
        trim: true,
        index: true
    },
    noOfContractEmployees: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    noOfContractEmpDet: {
        type: String,
        trim: true,
        index: true
    },
    noOfContractEmpFile: {
        type: Object
    },
    noOfContractEmpRemark: {
        type: String,
        trim: true,
        index: true
    },
    noOfContractors: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    noOfContractorsDet: {
        type: String,
        trim: true,
        index: true
    },
    noOfContractorsFile: {
        type: Object
    },
    noOfContractorsRemark: {
        type: String,
        trim: true,
        index: true
    },
    // -------------- E.1. Dets of the Labor Contractotrs---------------------
    nameOfContractor: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    nameOfContractorsDet: {
        type: String,
        trim: true,
        index: true
    },
    nameOfContractorsFile: {
        type: Object
    },
    nameOfContractorsRemark: {
        type: String,
        trim: true,
        index: true
    },
    nameOfEstablishment: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    nameOfEstablishmentDet: {
        type: String,
        trim: true,
        index: true
    },
    nameOfEstablishmentFile: {
        type: Object
    },
    nameOfEstablishmentRemark: {
        type: String,
        trim: true,
        index: true
    },
    regAddContractor: {
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
    regAddContractorDet: {
        type: String,
        trim: true,
        index: true
    },
    regAddContractorFile: {
        type: Object
    },
    regAddContractorRemark: {
        type: String,
        trim: true,
        index: true
    },
    // ----------------- E.2. Agreement Date -----------------------
    agreementExpiryDate: {
        type: Date,
        required: true,
        index: true
    },
    agreementExpiryDateDet: {
        type: String,
        trim: true,
        index: true
    },
    // nameOfEstablishmentFile: {
    //     type: Object
    // },
    agreementExpiryDateRemark: {
        type: String,
        trim: true,
        index: true
    },
    agreementRenewalDate: {
        type: Date,
        required: true,
        index: true
    },
    agreementRenewalDateDet: {
        type: String,
        trim: true,
        index: true
    },
    // nameOfEstablishmentFile: {
    //     type: Object
    // },
    agreementRenewalDateRemark: {
        type: String,
        trim: true,
        index: true
    },
    natureOfWorkAgreement: {
        type: String,
        required: true,
        trim : true,
        index: true
    },
    natureOfWorkAgreementDet: {
        type: String,
        trim: true,
        index: true
    },
    natureOfWorkAgreementFile: {
        type: Object
    },
    natureOfWorkAgreementRemark: {
        type: String,
        trim: true,
        index: true
    },
    noOfEmpDeployedAgreement: {
        type: String,
        required: true,
        trim : true,
        index: true
    },
    noOfEmpDeployedAgreementDet: {
        type: String,
        trim: true,
        index: true
    },
    noOfEmpDeployedAgreementFile: {
        type: Object
    },
    noOfEmpDeployedAgreementRemark: {
        type: String,
        trim: true,
        index: true
    },
    // -------------------------- E.3. Contractors Registration Dets -------------------------
    companyTypeLabour: {
        type: String,
        required: true,
        trim : true,
        index: true
    },
    companyTypeLabourDet: {
        type: String,
        trim: true,
        index: true
    },
    companyTypeLabourFile: {
        type: Object
    },
    companyTypeLabourRemark: {
        type: String,
        trim: true,
        index: true
    },
    contractLabourLicNo: {
        type: String,
        required: true,
        trim : true,
        index: true
    },
    contractLabourLicNoDet: {
        type: String,
        trim: true,
        index: true
    },
    contractLabourLicNoFile: {
        type: Object
    },
    contractLabourLicNoRemark: {
        type: String,
        trim: true,
        index: true
    },
    contractLicDate: {
        type: Date,
        required: true,
        index: true
    },
    contractLicDateDet: {
        type: String,
        trim: true,
        index: true
    },
    // contractLicDateFile: {
    //     type: Object
    // },
    contractLicDateRemark: {
        type: String,
        trim: true,
        index: true
    },
    contractExpiryDate: {
        type: Date,
        required: true,
        index: true
    },
    contractExpiryDateDet: {
        type: String,
        trim: true,
        index: true
    },
    // contractExpiryDateFile: {
    //     type: Object
    // },
    contractExpiryDateRemark: {
        type: String,
        trim: true,
        index: true
    },
    contractRenewalDueDate: {
        type: Date,
        required: true,
        index: true
    },
    contractRenewalDueDateDet: {
        type: String,
        trim: true,
        index: true
    },
    // contractRenewalDueDateFile: {
    //     type: Object
    // },
    contractRenewalDueDateRemark: {
        type: String,
        trim: true,
        index: true
    },
    noOfWorkersContract: {
        type: String,
        required: true,
        trim : true,
        index: true
    },
    noOfWorkersContractDet: {
        type: String,
        trim: true,
        index: true
    },
    noOfWorkersContractFile: {
        type: Object
    },
    noOfWorkersContractRemark: {
        type: String,
        trim: true,
        index: true
    },
    panContractors: {
        type: String,
        required: true,
        trim : true,
        index: true
    },
    panContractorsDet: {
        type: String,
        trim: true,
        index: true
    },
    panContractorsFile: {
        type: Object
    },
    panContractorsRemark: {
        type: String,
        trim: true,
        index: true
    },
    gstContractors: {
        type: String,
        required: true,
        trim : true,
        index: true
    },
    gstContractorsDet: {
        type: String,
        trim: true,
        index: true
    },
    gstContractorsFile: {
        type: Object
    },
    gstContractorsRemark: {
        type: String,
        trim: true,
        index: true
    },
    pfRegContractors: {
        type: String,
        required: true,
        trim : true,
        index: true
    },
    pfRegContractorsDet: {
        type: String,
        trim: true,
        index: true
    },
    pfRegContractorsFile: {
        type: Object
    },
    pfRegContractorsRemark: {
        type: String,
        trim: true,
        index: true
    },
    esicRegContractors: {
        type: String,
        required: true,
        trim : true,
        index: true
    },
    esicRegContractorsDet: {
        type: String,
        trim: true,
        index: true
    },
    esicRegContractorsFile: {
        type: Object
    },
    esicRegContractorsRemark: {
        type: String,
        trim: true,
        index: true
    },
    shopsandEstContractors: {
        type: String,
        required: true,
        trim : true,
        index: true
    },
    shopsandEstContractorsDet: {
        type: String,
        trim: true,
        index: true
    },
    shopsandEstContractorsFile: {
        type: Object
    },
    shopsandEstContractorsRemark: {
        type: String,
        trim: true,
        index: true
    },
    lwfRegContractors: {
        type: String,
        required: true,
        trim : true,
        index: true
    },
    lwfRegContractorsDet: {
        type: String,
        trim: true,
        index: true
    },
    lwfRegContractorsFile: {
        type: Object
    },
    lwfRegContractorsRemark: {
        type: String,
        trim: true,
        index: true
    },
    profTaxContractors: {
        type: String,
        required: true,
        trim : true,
        index: true
    },
    profTaxContractorsDet: {
        type: String,
        trim: true,
        index: true
    },
    profTaxContractorsFile: {
        type: Object
    },
    profTaxContractorsRemark: {
        type: String,
        trim: true,
        index: true
    },

},
    { timestamps: true })

const LabourContractor = mongoose.model('LabourContractor', labourContractorSchema)
export default LabourContractor