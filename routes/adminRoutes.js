import express from "express";
import cors from 'cors'
import { isAdmin,protectRoute } from '../middlewares/authMiddleware.js';
import axios from 'axios'; //here axios only used to validate reCaptcha
import {login,logout,catCreate,catGettting,catEditById,complianceCreate, complianceGetting, userCreate, userGetting, stateCreate, checkListCreate, checkListGetting, checkListFilter, checkListFind, createBranch, branchGetting, createNotification, notificationGetting, addlist, checkData, getCheckData, updateCompliancesById, complianceFilter, complianceRejectedFilter, checkListRejectedFilter, checkListCreateFilter, checkListApproveFilter, checkListAllFilter, createElibrary, elibraryGetting, checklistOnCreateegetting, checklistApprovegetting, checklistOnRejectegetting } from '../controllers/Admin.js';

import { upload } from "../middlewares/multerConfig.js";
// import multer from "multer";
// import path from "path";
const router = express.Router();

router.post('/login',login); 
router.get('/logout',logout);
router.post('/catCreate',catCreate);
router.get('/catGettting',catGettting);
// router.post('/add-user',createUsers); //router.route('/add-user').post(protectRoute,createUsers); both the ways will work
// router.route('/user-profile/:id').get(protectRoute,usersProfileById);  //this way of request routes is also be taken 
// router.put('/update-user-profile/:id',protectRoute,updateUsersProfileById);
router.put('/catEditById/:id',protectRoute,catEditById);
// router.route('/allUsers/:id').get(protectRoute,isAdmin,allUsers);
// router.post('/searchUsersRecords/:id',protectRoute,isAdmin,searchUsersRecordsNav);
// router.get('/confirmuser/:token',confirmuser);       
// router.delete('/delete/:id',deleteUsers);
// const storage = multer.memoryStorage();
  
// var upload = multer({ storage: storage })
router.post('/complianceCreate',  upload.fields([{ name: 'form' }, { name: 'docattachment' }]), complianceCreate )
router.post('/complianceFilter', complianceFilter )
router.post('/complianceRejectedFilter', complianceRejectedFilter )
router.get('/complianceGetting', complianceGetting )
router.put('/updateCompliancesById/:id', upload.fields([{ name: 'form' }, { name: 'docattachment' }]), updateCompliancesById )

// --------- User Route ----------
router.post('/userCreate', userCreate )
router.get('/userGetting', userGetting )

// --------State Route : -----------
router.post('/stateCreate', stateCreate )

// -------------Checklist Route --------------
router.post('/checkListCreate', upload.fields([{ name: 'image' }, { name: 'documents' }]), checkListCreate)
router.get('/checkListGetting', checkListGetting)
router.get('/checklistOnCreateegetting', checklistOnCreateegetting)
router.get('/checklistOnRejectegetting', checklistOnRejectegetting)
router.get('/checklistApprovegetting', checklistApprovegetting)
// router.get('/checkListFilter/:state/:createdAt', checkListFilter)
router.get('/checkListFilter', checkListFilter)
router.get('/checkListFind', checkListFind)
router.post('/checkListAllFilter', checkListAllFilter)
router.post('/checkListApproveFilter', checkListApproveFilter)
router.post('/checkListCreateFilter', checkListCreateFilter)
router.post('/checkListRejectedFilter', checkListRejectedFilter)

// --------------- Branch Route --------------
router.post('/createBranch', createBranch)
router.get('/branchGetting', branchGetting)

// -------------------- Notification Route -----------
router.post('/createNotification', createNotification)
router.get('/notificationGetting', notificationGetting)

// ------------------ Executive Route -----------

// router.post('/createExecutive', createExecutive)
// router.get('/executiveGetting', executiveGetting)

router.post('/addlist', addlist)

router.post('/checkData', checkData)
router.get('/getCheckData', getCheckData)


// --------- Elibrary Routes ------------------
router.post('/createElibrary', upload.single('image'), createElibrary)
router.get('/elibraryGetting', elibraryGetting)

export default router;
