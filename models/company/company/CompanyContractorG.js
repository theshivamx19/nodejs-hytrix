import mongoose from "mongoose";

// ------------------ G. Is the Company a Contractor ------------------

const companyContractorSchema = new mongoose.Schema({
    isLabourEngaged: {
        type: Boolean,
        default : false,
        index: true,
    },
    isLabourEngagedDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    isLabourEngagedFile: {
        type: Object,
        default: null
    },
    isLabourEngagedRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfClient: {
        type: String,
        required : true,
        trim : true,
        index: true,
    },
    noOfClientDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfClientFile: {
        type: Object,
        default: null
    },
    noOfClientRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    client1: {
        type: Date,
        required : true,
        trim : true,
        index: true,
    },
    client1Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    client1File: {
        type: Object,
        default: null
    },
    client1Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regOfficeAddClient1: {
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
    regOfficeAddClient1Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regOfficeAddClient1File: {
        type: Object,
        default: null
    },
    regOfficeAddClient1Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    client2: {
        type: Date,
        required : true,
        trim : true,
        index: true,
    },
    client2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    client2File: {
        type: Object,
        default: null
    },
    client2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regOfficeAddClient2: {
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
    regOfficeAddClient2Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regOfficeAddClient2File: {
        type: Object,
        default: null
    },
    regOfficeAddClient2Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // ------------------- G.1.1. Details of the Contract Work -----------------
 
    noOfLocContractWork: {
        type: String,
        required : true,
        trim : true,
        index: true,
    },
    noOfLocContractWorkDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfLocContractWorkFile: {
        type: Object,
        default: null
    },
    noOfLocContractWorkRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    firstRegAddOfClient: {
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
    firstRegAddOfClientDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    firstRegAddOfClientFile: {
        type: Object,
        default: null
    },
    firstRegAddOfClientRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    secondRegAddOfClient: {
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
    secondRegAddOfClientDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    secondRegAddOfClientFile: {
        type: Object,
        default: null
    },
    secondRegAddOfClientRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    client2G11: {
        type: Date,
        required : true,
        trim : true,
        index: true,
    },
    client2G11Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    client2G11File: {
        type: Object,
        default: null
    },
    client2G11Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regAddOfClient2G11: {
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
    regAddOfClient2G11Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    regAddOfClient2G11File: {
        type: Object,
        default: null
    },
    regAddOfClient2G11Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },

    // ---------------- G.1.2. Nature of the Contract Work ----------------
    agreementRefNoG12: {
        type: String,
        required : true,
        trim : true,
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
        required : true,
        trim : true,
        index: true,
    },
    agreementDateG12Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // agreementDateG12File: {
    //     type: Object,
    //     default: null
    // },
    agreementDateG12Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    agreementValidityG12: {
        type: Date,
        required : true,
        trim : true,
        index: true,
    },
    agreementValidityG12Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // agreementValidityG12File: {
    //     type: Object,
    //     default: null
    // },
    agreementValidityG12Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    noOfWorkersEngagedG12: {
        type: String,
        required : true,
        trim : true,
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
        required : true,
        trim : true,
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
        default : false,
        index: true,
    },
    isClraApplicableG12Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    isClraApplicableG12File: {
        type: Object,
        default: null
    },
    isClraApplicableG12Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // ----------------- G.1.3. Details of CLRA License -------------------
    noOfForm5G13: {
        type: String,
        required : true,
        trim : true,
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
        required : true,
        trim : true,
        index: true,
    },
    form5DateG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // form5DateG13File: {
    //     type: Object,
    //     default: null
    // },
    form5DateG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    workCommencedDateG13: {
        type: Date,
        required : true,
        trim : true,
        index: true,
    },
    workCommencedDateG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // workCommencedDateG13File: {
    //     type: Object,
    //     default: null
    // },
    workCommencedDateG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraLicenseNumberG13: {
        type: String,
        required : true,
        trim : true,
        index: true,
    },
    clraLicenseNumberG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraLicenseNumberG13File: {
        type: Object,
        default: null
    },
    clraLicenseNumberG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraLicenseDateG13: {
        type: Date,
        required : true,
        trim : true,
        index: true,
    },
    clraLicenseDateG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // clraLicenseDateG13File: {
    //     type: Object,
    //     default: null
    // },
    clraLicenseDateG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraValidityG13: {
        type: Date,
        required : true,
        trim : true,
        index: true,
    },
    clraValidityG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // clraValidityG13File: {
    //     type: Object,
    //     default: null
    // },
    clraValidityG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraRenewalDueG13: {
        type: Date,
        required : true,
        trim : true,
        index: true,
    },
    clraRenewalDueG13Det: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // clraRenewalDueG13File: {
    //     type: Object,
    //     default: null
    // },
    clraRenewalDueG13Remark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    clraNoOfContWorkersG13: {
        type: String,
        required : true,
        trim : true,
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
        required : true,
        trim : true,
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
        required : true,
        trim : true,
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
        required : true,
        trim : true,
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
        required : true,
        trim : true,
        index: true,
    },
    contWorkCompletedDateDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // contWorkCompletedDateFile: {
    //     type: Object,
    //     default: null
    // },
    contWorkCompletedDateRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    contWorkComplitionNotice: {
        type: Date,
        required : true,
        trim : true,
        index: true,
    },
    contWorkComplitionNoticeDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // contWorkComplitionNoticeFile: {
    //     type: Object,
    //     default: null
    // },
    contWorkComplitionNoticeRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    refundSecDepNotice: {
        type: Date,
        required : true,
        trim : true,
        index: true,
    },
    refundSecDepNoticeDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // refundSecDepNoticeFile: {
    //     type: Object,
    //     default: null
    // },
    refundSecDepNoticeRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    licSurrenderedDate: {
        type: Date,
        required : true,
        trim : true,
        index: true,
    },
    licSurrenderedDateDet: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    // licSurrenderedDateFile: {
    //     type: Object,
    //     default: null
    // },
    licSurrenderedDateRemark: {
        type: String,
        trim: true,
        default: null,
        index: true
    },
    status : {
        type : Number,
        default : 0,
        index : true
    }
}, {timestamps : true})