import multer from 'multer';
import path from 'path';
// import v4:uuidv4 from 'uuid';
import { v4 as uuidv4 } from 'uuid';


const storage = multer.memoryStorage({
  
  // destination: function (req, file, cb) {
  //   console.log('i hre');
  //   if (
  //     file.mimetype === 'image/png' ||
  //     file.mimetype === 'image/jpg' ||
  //     file.mimetype === 'image/jpeg'
  //   ) {
  //     // sharp(req.file).resize({ width: 600 });
  //     cb(null, "./public/images/")
  //   }
  //   else if (file.mimetype === 'application/pdf') {
  //     // sharp(req.file);
  //     cb(null, "./public/docs/")
  //   }
  // },
  // filename: function (req, file, cb) {
  //   const unique = uuidv4();
  //   cb(null, unique + path.extname(file.originalname))
  // }
})
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, 'image');
  } else if (file.mimetype === 'application/pdf') {
    cb(null, 'document');
  } else {
    cb(new Error('Invalid file type'), false);
  }
};
// var upload = multer({ storage: storage })

export const upload = multer({
  storage, fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  }
})