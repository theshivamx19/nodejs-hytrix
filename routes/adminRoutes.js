import express from "express";
import { isAdmin,protectRoute } from '../middlewares/authMiddleware.js';
import axios from 'axios'; //here axios only used to validate reCaptcha
import {login,logout,catCreate,catGettting,catEditById,complianceCreate, complianceGetting} from '../controllers/Admin.js';
const router = express.Router();

router.post('/login',login); 
router.get('/logout',logout);
router.post('/catCreate',protectRoute,catCreate);
router.get('/catGettting',protectRoute,catGettting);
// router.post('/add-user',createUsers); //router.route('/add-user').post(protectRoute,createUsers); both the ways will work
// router.route('/user-profile/:id').get(protectRoute,usersProfileById);  //this way of request routes is also be taken 
// router.put('/update-user-profile/:id',protectRoute,updateUsersProfileById);
router.put('/catEditById/:id',protectRoute,catEditById);
// router.route('/allUsers/:id').get(protectRoute,isAdmin,allUsers);
// router.post('/searchUsersRecords/:id',protectRoute,isAdmin,searchUsersRecordsNav);
// router.get('/confirmuser/:token',confirmuser);       
// router.delete('/delete/:id',deleteUsers);

router.post('/complianceCreate', complianceCreate )
router.get('/complianceGetting', complianceGetting )

export default router;