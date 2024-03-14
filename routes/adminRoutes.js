import express from "express";
import { isAdmin,protectRoute } from '../middlewares/authMiddleware.js';
import axios from 'axios'; //here axios only used to validate reCaptcha
import {login,logout,auditoreGet,createAudit,catCreate,catGettting,catEditById,deleteCat,stateGetting,gettingUser,notificationCreate,createUser,editUser,deleteUser,gettingCompany,gettingCompanyTable,gettingBranch,gettingCompliances,gettingCompliancesAll,createBranch,createCompliances,gettingNotification,gettingCompliancesById,gettingCompliancesOnCreate,updateCompliancesById,complianceApporve,gettingCompliancesReject,complianceReject,complianceFilter,complianceRejectedFilter,gettingCompliancesAllFilter,checkListCreate,checkListFind,updateChecklistsById,checklistOnCreateegetting,gettingchecklistById,checklistAllgetting,checklistApporve,checkListAllFilter,checkListCreateFilter,checklistApprovegetting,checkListApproveFilter,checklistOnRejectegetting,rejectChecklist,checkListRejectedFilter,gettingchecklistAllCompliance,complianceApproveFilter,gettingAuditDetail,createLiseReg,liseRegGetting,liseRegUpdateById,liseRegHistoryFilter,regsApporve,liseRegGettingById,auditChecklistFilter,auditchecklistGetonCreate,auditFilter,gettingOnGoingAuditDetail,gettingAuditorOverdueDashboard,elibraryCreate,createCompany} from '../controllers/Admin.js';//elibraryGet ,createRegistrationTab2,createRegistrationTab3,createRegistrationTab4,createRegistrationTab5,createRegistrationTab6,createRegistrationTab7
import { upload } from "../middlewares/multerConfig.js";
const router = express.Router();
router.post('/login',login); 
router.get('/logout',logout);
/*audit start*/
router.post('/auditCreate',protectRoute, createAudit)
router.get('/auditoreGet',protectRoute,auditoreGet);
router.get('/gettingOnGoingAuditDetail',protectRoute, gettingOnGoingAuditDetail)
router.get('/gettingOverviewAuditDetail',protectRoute, gettingAuditorOverdueDashboard)
router.get('/gettingAuditDetail',protectRoute, gettingAuditDetail)
router.post('/auditChecklistFilter',protectRoute,auditChecklistFilter)
router.get('/auditchecklistGetonCreate',protectRoute,auditchecklistGetonCreate)
// router.post('/auditFilter',protectRoute, auditFilter);
router.post('/auditAllFilter',protectRoute, auditFilter);
// router.post('/executiveGet',protectRoute, executiveGet)

/*audit ends*/
/**Elibrary start */
router.post('/elibraryCreate',upload.single("image"),protectRoute, elibraryCreate)
// router.get('/elibraryGet',protectRoute, elibraryGet)
/**Elibrary end */
/*category start*/
router.post('/catCreate',protectRoute,catCreate);
router.get('/catGettting',protectRoute,catGettting);
router.put('/catEditById/:id',protectRoute,catEditById);
router.delete('/deleteCat/:id',protectRoute,deleteCat);
/*category ends*/
router.get('/stateGetting',protectRoute,stateGetting);
router.post('/notificationCreate', upload.single("document"),protectRoute,notificationCreate);
router.get('/gettingNotification',protectRoute, gettingNotification);
router.get('/comapany/:comany/:state/:date',protectRoute,notificationCreate);
/*users start*/
router.post('/userCreate',protectRoute, createUser )
router.get('/gettingUser',protectRoute,gettingUser);
router.put('/editUser/:id',protectRoute,editUser);
router.delete('/deleteUser/:id',protectRoute,deleteUser);
/*users ends*/
/*branch start*/
router.get('/gettingBranch',protectRoute, gettingBranch);
router.post('/createBranch',protectRoute, createBranch);
/*branh ends*/
/*compliance start*/
router.post('/createCompliances',upload.fields([{ name: 'image' }, { name: 'document' }]),protectRoute, createCompliances);
router.get('/gettingCompliances',protectRoute, gettingCompliances);
router.get('/gettingCompliancesAll',protectRoute, gettingCompliancesAll);
router.get('/gettingCompliancesOnCreate',protectRoute, gettingCompliancesOnCreate);
router.get('/gettingCompliancesById/:id',protectRoute,gettingCompliancesById);
router.put('/updateCompliancesById/:id',upload.fields([{ name: 'image' }, { name: 'document' }]),protectRoute,updateCompliancesById);
router.patch('/complianceApporve',protectRoute,complianceApporve);
router.patch('/complianceReject',protectRoute,complianceReject);
router.post('/complianceApproveFilter', protectRoute,complianceApproveFilter );
router.post('/gettingCompliancesFilter', protectRoute,complianceFilter );
router.post('/gettingCompliancesAllFilter', protectRoute,gettingCompliancesAllFilter);
router.post('/gettingCompliancesRejetFilter', protectRoute,complianceRejectedFilter);
router.get('/gettingCompliancesReject',protectRoute, gettingCompliancesReject);
/*compliance ends*/
/*checklist start*/
router.post('/checkListCreate', upload.fields([{ name: 'image' }, { name: 'document' }]) ,protectRoute, checkListCreate)
router.get('/checkListGetting',protectRoute, checkListFind);
router.put('/updateChecklistsById/:id',upload.fields([{ name: 'image' }, { name: 'document' }]),protectRoute,updateChecklistsById);
router.get('/checklistOnCreateegetting',protectRoute, checklistOnCreateegetting);
router.get('/gettingchecklistById/:id',protectRoute,gettingchecklistById);
router.get('/checklistAllgetting',protectRoute, checklistAllgetting);
router.get('/checklistApprovegetting',protectRoute, checklistApprovegetting)
router.patch('/checklistApporve',protectRoute,checklistApporve);
router.post('/checkListAllFilter',protectRoute, checkListAllFilter)
router.post('/checkListApproveFilter',protectRoute, checkListApproveFilter)
router.post('/checkListCreateFilter',protectRoute, checkListCreateFilter)
router.get('/checklistOnRejectegetting',protectRoute, checklistOnRejectegetting) 
router.patch('/rejectChecklist',protectRoute, rejectChecklist)
router.post('/checkListRejectedFilter',protectRoute, checkListRejectedFilter)
/*checklist ends*/
/* getting compliance for checklist select start*/
router.get('/gettingchecklistAllCompliance',protectRoute, gettingchecklistAllCompliance)

/* getting compliance for checklist select ends*/
/*liseReg start*/ 
router.post('/createLiseReg', upload.fields([{ name: 'licenseUpload' }, { name: 'challanUpload' }, { name: 'acknowledge' }, { name: 'documents' }]), protectRoute,createLiseReg)
router.get('/liseRegGetting', protectRoute,liseRegGetting)
router.get('/liseRegGettingById/:id', protectRoute,liseRegGettingById)
router.put('/liseRegUpdateById/:id', upload.fields([{ name: 'licenseUpload' }, { name: 'challanUpload' }, { name: 'acknowledge' }, { name: 'documents' }]), protectRoute, liseRegUpdateById)
router.post('/liseRegHistoryFilter', protectRoute, liseRegHistoryFilter)
router.patch('/regsApporve', protectRoute, regsApporve)
/*liseReg end*/

/*checking which routes are called start*/
router.use((req, res, next) => {
    console.log(`In router: ${req.method}:${req.originalUrl}`);
    next();
});
/*checking which routes are called ends*/
/*company start*/
router.post('/createCompany',upload.any(),protectRoute, createCompany);
router.get('/gettingCompany',protectRoute, gettingCompany);
router.get('/gettingCompanyTable',protectRoute, gettingCompanyTable);
/*company end*/
// router.post('/createCompany',  upload.any(), protectRoute,createCompany)
// router.post('/companytab2',  upload.array('files'), protectRoute,createRegistrationTab2)
// router.post('/companytab2',  upload.any(), protectRoute,createRegistrationTab2)
// router.post('/companytab3',  upload.any(), protectRoute,createRegistrationTab3)
// router.post('/companytab4',  upload.any(), protectRoute,createRegistrationTab4)
// router.post('/companytab5',  upload.any(), protectRoute,createRegistrationTab5)
// router.post('/companytab6',  upload.any(), protectRoute,createRegistrationTab6)
// router.post('/companytab7', upload.any(), protectRoute,createRegistrationTab7)

export default router;
