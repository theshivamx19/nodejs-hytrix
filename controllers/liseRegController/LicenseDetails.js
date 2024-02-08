import LicenseDetails from '../../models/liseReg/LicenseDetails.js'
import fs from 'fs'
import sharp from 'sharp';


export const createLicenseDetail = async (request, response, next) => {
    try {
        const data = request.body
        const licenseUpload = request.file;
        console.log(data, licenseUpload);
        const { licenseNumber, dateOfIssue, renewalDate, expireDate, status, company, executive, state, branch } = data
        
        const url = request.protocol + '://' + request.get('host');
        const formattedImageFileName = Date.now() + licenseUpload.originalname.split(' ').join('-');
        
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

        await sharp(licenseUpload.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedImageFileName);
        const imageUrl = url + '/' + imageDirectory + formattedImageFileName;
        const licenseDetail = {
            licenseNumber, dateOfIssue, renewalDate, expireDate, licenseUpload : imageUrl, status, company, executive, state, branch
        }
        const newLicenseDetail = new LicenseDetails(licenseDetail)
        await newLicenseDetail.save()
        response.status(201).json(newLicenseDetail)
    } catch (error) {
        next(error)
    }
}

export const licenseDetailGetting = async (request, response, next) => {
    try {
        const license = await LicenseDetails.find({})
        response.status(201).json(license)
    }
    catch (error) {
        next(error)
    }
}   