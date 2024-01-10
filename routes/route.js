import express from 'express';
const router = express.Router();
import adminController from '../controllers/Admin.js'
import { upload } from '../middlewares/MulterMiddleware.js';


router.post('/admin-registration', upload.single('image'), adminController.adminRegistration)
router.post('/login', adminController.login)

// router.post('/imageUpload', adminController.imageUpload)

export default router;