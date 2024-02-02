import Applicationdetails from "../../models/liseReg/ApplicationDetails.js"

export const createApplicationDetail = async (request, response, next) => {
    try {
        const data = data.body
        const { appliedDate, status, remark } = data

        const acknowledge = request.file;
        const url = request.protocol + '://' + request.get('host');
        const formattedImageFileName = Date.now() + acknowledge.originalname.split(' ').join('-');

        const uploadsDirectory = './data/uploads/';
        const imageDirectory = 'images/';

        fs.access(uploadsDirectory, (err) => {
            if (err) {
                fs.mkdirSync(uploadsDirectory, { recursive: true });
            }
        });

        // Ensure that the images directory exists
        fs.access(uploadsDirectory + imageDirectory, (err) => {
            if (err) {
                fs.mkdirSync(uploadsDirectory + imageDirectory, { recursive: true });
            }
        });

        await sharp(acknowledge.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedImageFileName);
        const imageUrl = url + '/' + imageDirectory + formattedImageFileName;
        const applicationDetail = {
            appliedDate, status, remark, acknowledge: imageUrl
        }
        const newApplicationDetail = await Applicationdetails(applicationDetail)
        await newApplicationDetail.save()
        response.status(201).json(newApplicationDetail)
    }
    catch (error) {
        next(error)
    }
}

export const appDetailGetting = async (request, response, next) => {
    try {
        const applications = await Applicationdetails.find({})
        response.status(201).json(applications)
    }
    catch (error) {
        next(error)
    }
}
