import multer from 'multer';
import path from 'path';
// import v4:uuidv4 from 'uuid';
import { v4 as uuidv4 } from 'uuid';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, "./public/images/")
    }
    else if (file.mimetype === 'application/pdf') {
      cb(null, "./public/docs/")
    }
  },
  filename: function (req, file, cb) {
    const unique = uuidv4();
    cb(null, unique + path.extname(file.originalname))
  }
})
const fileFilter = function (req, file, cb) {
  if (file.filename === 'document') {
    if (file.mimetype === 'application/pdf') {
      return cb(new Error('Only pdf doc is allowed!'), false)
    }
  }
  else
    if (file.filename === 'image') {
      if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      ) {
        // if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        // req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
      }

    }
  cb(null, true);
};


export const upload = multer({
  storage, fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  }
}).fields([{ name: 'document', maxCount: 5 }, { name: 'image', maxCount: 5 }])