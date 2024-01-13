import express from 'express';
const router = express.Router();
import adminController from '../controllers/Admin.js'
import { upload } from '../middlewares/multerConfig.js';


router.post('/admin-registration', upload.single('image'), adminController.AdminReg)
router.post('/login', adminController.Login)
router.post('/create-category', adminController.CreateCategory)
router.get('/jsonApi', adminController.jsonApi)

// router.post('/imageUpload', adminController.imageUpload)

export default router;