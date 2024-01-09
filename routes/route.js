import express from 'express';
const router = express.Router();
import adminController from '../controllers/adminController.js'
import { upload } from '../middlewares/multerMiddleware.js';


router.post('/admin-registration', upload.single('image'), adminController.adminRegistration)
router.post('/login', adminController.login)

// router.post('/imageUpload', adminController.imageUpload)

export default router;