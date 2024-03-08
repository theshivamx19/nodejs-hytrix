import mongoose from "mongoose";

// -------------------------- F. Details of the Branch's(1) ---------------------------

const branchDetailSchema = new mongoose.Schema({
    noOfBranchesF: {
        type: String,
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        default : false,
        trim: true,
        index: true,
    },
    // isContractLabourEngagedF5Det: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
    // isContractLabourEngagedF5File: {
    //     type: Object,
    //     default: null
    // },
    // isContractLabourEngagedF5Remark: {
    //     type: String,
    //     trim: true,
    //     default: null,
    //     index: true
    // },
    contractLabRegNoF5: {
        type: String,
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
    // ------------- D.5.2. Agreement Date -----------------------
    expiryDateF52: {
        type: Date,
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
        required: true,
        trim: true,
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
    status : {
        type : Number,
        default : 0,
        index : true
    }

}, { timestamps: true })

const Branchdetail = mongoose.model('Branchdetail', branchDetailSchema)
export default Branchdetail;