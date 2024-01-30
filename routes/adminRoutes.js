import express from "express";
import { isAdmin,protectRoute } from '../middlewares/authMiddleware.js';
import axios from 'axios'; //here axios only used to validate reCaptcha
import {login,logout,catCreate,catGettting,catEditById,complianceCreate, complianceGetting, userCreate, userGetting, stateCreate, checkListCreate, checkListGetting, checkListFilter, findByDate} from '../controllers/Admin.js';
import { upload } from "../middlewares/multerConfig.js";
// import multer from "multer";
// import path from "path";
const router = express.Router();

router.post('/login',login); 
router.get('/logout',logout);
router.post('/catCreate',catCreate);
router.get('/catGettting',protectRoute,catGettting);
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
router.post('/complianceCreate', complianceCreate )
router.get('/complianceGetting', complianceGetting )

// --------- User Route ----------
router.post('/userCreate', userCreate )
router.get('/userGetting', userGetting )

// --------State Route : -----------
router.get('/stateCreate', stateCreate )

// -------------Checklist Route --------------
router.post('/checkListCreate', upload.fields([{ name: 'image' }, { name: 'document' }]), checkListCreate)
router.get('/checkListGetting', checkListGetting)
// router.get('/checkListFilter/:state/:createdAt', checkListFilter)
router.get('/checkListFilter', checkListFilter)
router.get('/findByDate/:id', findByDate)

export default router;
