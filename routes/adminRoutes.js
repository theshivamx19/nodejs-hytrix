import express from "express";
import { isAdmin, protectRoute } from '../middlewares/authMiddleware.js';
import axios from 'axios'; //here axios only used to validate reCaptcha
import { login, logout, auditoreGet, createAudit, catCreate, catGettting, catEditById, deleteCat, stateGetting, gettingUser, notificationCreate, createUser, editUser, deleteUser, gettingCompany, gettingCompanyTable, gettingBranch, gettingCompliances, gettingCompliancesAll, createBranch, createCompliances, gettingNotification, gettingCompliancesById, gettingCompliancesOnCreate, updateCompliancesById, complianceApporve, gettingCompliancesReject, complianceReject, complianceFilter, complianceRejectedFilter, gettingCompliancesAllFilter, checkListCreate, checkListFind, updateChecklistsById, checklistOnCreateegetting, gettingchecklistById, checklistAllgetting, checklistApporve, checkListAllFilter, checkListCreateFilter, checklistApprovegetting, checkListApproveFilter, checklistOnRejectegetting, rejectChecklist, checkListRejectedFilter, gettingchecklistAllCompliance, complianceApproveFilter, gettingAuditDetail, createLiseReg, liseRegGetting, liseRegUpdateById, liseRegHistoryFilter, regsApporve, liseRegGettingById, auditChecklistFilter, auditchecklistGetonCreate, auditFilter, gettingOnGoingAuditDetail, gettingAuditorOverdueDashboard, elibraryCreate, createCompany, gettingCompanyById } from '../controllers/Admin.js';

//elibraryGet ,createRegistrationTab2,createRegistrationTab3,createRegistrationTab4,createRegistrationTab5,createRegistrationTab6,createRegistrationTab7
import { upload } from "../middlewares/multerConfig.js";
const router = express.Router();
router.post('/login', login);
router.get('/logout', logout);
/*audit start*/
router.post('/auditCreate', createAudit)
router.get('/auditoreGet', auditoreGet);
router.get('/gettingOnGoingAuditDetail', gettingOnGoingAuditDetail)
router.get('/gettingOverviewAuditDetail', gettingAuditorOverdueDashboard)
router.get('/gettingAuditDetail', gettingAuditDetail)
router.post('/auditChecklistFilter', auditChecklistFilter)
router.get('/auditchecklistGetonCreate', auditchecklistGetonCreate)
// router.post('/auditFilter', auditFilter);
router.post('/auditAllFilter', auditFilter);
// router.post('/executiveGet', executiveGet)

/*audit ends*/
/**Elibrary start */
router.post('/elibraryCreate', upload.single("image"), elibraryCreate)
// router.get('/elibraryGet', elibraryGet)
/**Elibrary end */
/*category start*/
router.post('/catCreate', catCreate);
router.get('/catGettting', catGettting);
router.put('/catEditById/:id', catEditById);
router.delete('/deleteCat/:id', deleteCat);
/*category ends*/
router.get('/stateGetting', stateGetting);
router.post('/notificationCreate', upload.single("document"), notificationCreate);
router.get('/gettingNotification', gettingNotification);
router.get('/comapany/:comany/:state/:date', notificationCreate);
/*users start*/
router.post('/userCreate', createUser)
router.get('/gettingUser', gettingUser);
router.put('/editUser/:id', editUser);
router.delete('/deleteUser/:id', deleteUser);
/*users ends*/
/*branch start*/
router.get('/gettingBranch', gettingBranch);
router.post('/createBranch', createBranch);
/*branh ends*/
/*compliance start*/
router.post('/createCompliances', upload.fields([{ name: 'image' }, { name: 'document' }]), createCompliances);
router.get('/gettingCompliances', gettingCompliances);
router.get('/gettingCompliancesAll', gettingCompliancesAll);
router.get('/gettingCompliancesOnCreate', gettingCompliancesOnCreate);
router.get('/gettingCompliancesById/:id', gettingCompliancesById);
router.put('/updateCompliancesById/:id', upload.fields([{ name: 'image' }, { name: 'document' }]), updateCompliancesById);
router.patch('/complianceApporve', complianceApporve);
router.patch('/complianceReject', complianceReject);
router.post('/complianceApproveFilter', complianceApproveFilter);
router.post('/gettingCompliancesFilter', complianceFilter);
router.post('/gettingCompliancesAllFilter', gettingCompliancesAllFilter);
router.post('/gettingCompliancesRejetFilter', complianceRejectedFilter);
router.get('/gettingCompliancesReject', gettingCompliancesReject);
/*compliance ends*/
/*checklist start*/
router.post('/checkListCreate', upload.fields([{ name: 'image' }, { name: 'document' }]), checkListCreate)
router.get('/checkListGetting', checkListFind);
router.put('/updateChecklistsById/:id', upload.fields([{ name: 'image' }, { name: 'document' }]), updateChecklistsById);
router.get('/checklistOnCreateegetting', checklistOnCreateegetting);
router.get('/gettingchecklistById/:id', gettingchecklistById);
router.get('/checklistAllgetting', checklistAllgetting);
router.get('/checklistApprovegetting', checklistApprovegetting)
router.patch('/checklistApporve', checklistApporve);
router.post('/checkListAllFilter', checkListAllFilter)
router.post('/checkListApproveFilter', checkListApproveFilter)
router.post('/checkListCreateFilter', checkListCreateFilter)
router.get('/checklistOnRejectegetting', checklistOnRejectegetting)
router.patch('/rejectChecklist', rejectChecklist)
router.post('/checkListRejectedFilter', checkListRejectedFilter)
/*checklist ends*/
/* getting compliance for checklist select start*/
router.get('/gettingchecklistAllCompliance', gettingchecklistAllCompliance)

/* getting compliance for checklist select ends*/
/*liseReg start*/
router.post('/createLiseReg', upload.fields([{ name: 'licenseUpload' }, { name: 'challanUpload' }, { name: 'acknowledge' }, { name: 'documents' }]), createLiseReg)
router.get('/liseRegGetting', liseRegGetting)
router.get('/liseRegGettingById/:id', liseRegGettingById)
router.put('/liseRegUpdateById/:id', upload.fields([{ name: 'licenseUpload' }, { name: 'challanUpload' }, { name: 'acknowledge' }, { name: 'documents' }]), liseRegUpdateById)
router.post('/liseRegHistoryFilter', liseRegHistoryFilter)
router.patch('/regsApporve', regsApporve)
/*liseReg end*/

/*checking which routes are called start*/
router.use((req, res, next) => {
    console.log(`In router: ${req.method}:${req.originalUrl}`);
    next();
});
/*checking which routes are called ends*/
/*company start*/
router.post('/createCompany', upload.any(), createCompany);
router.get('/gettingCompany', gettingCompany);
router.get('/gettingCompanyTable', gettingCompanyTable);
router.get('/gettingCompanyById/:id', gettingCompanyById);
/*company end*/
// router.post('/createCompany',  upload.any(), createCompany)
// router.post('/companytab2',  upload.array('files'), createRegistrationTab2)
// router.post('/companytab2',  upload.any(), createRegistrationTab2)
// router.post('/companytab3',  upload.any(), createRegistrationTab3)
// router.post('/companytab4',  upload.any(), createRegistrationTab4)
// router.post('/companytab5',  upload.any(), createRegistrationTab5)
// router.post('/companytab6',  upload.any(), createRegistrationTab6)
// router.post('/companytab7', upload.any(), createRegistrationTab7)

export default router;