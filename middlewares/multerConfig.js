import multer from 'multer';
import path from 'path';
// import v4:uuidv4 from 'uuid';
import { v4 as uuidv4 } from 'uuid';


const storage = multer.memoryStorage({
  

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