import express from 'express';
const router = express.Router();
import adminController from '../controllers/adminController.js'
import { upload } from '../middlewares/uploadMiddleware.js';


router.post('/admin-registration', adminController.adminRegistration)
router.post('/login', adminController.login)

router.post('/imageUpload', upload.single('image'), adminController.imageUpload)

export default router;