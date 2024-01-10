import multer from 'multer';
import path from 'path';
// import v4:uuidv4 from 'uuid';
import { v4 as uuidv4 } from 'uuid';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/')
  },
  filename: function (req, file, cb) {
    const unique = uuidv4();
    cb(null, unique + path.extname(file.originalname))
  }
})
const fileFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      // req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};


export const upload = multer({
  storage, fileFilter, 
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
})