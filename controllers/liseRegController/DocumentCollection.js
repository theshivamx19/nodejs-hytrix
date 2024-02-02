import DocumentCollection from '../../models/liseReg/DocumentCollection.js'
import fs from 'fs'
import sharp from 'sharp';


export const createDocCollection = async (request, response, next) => {
    try {
        const data = request.body
        console.log(data);

        const { docReqDate, docRegFollow, docReviewDate } = data
        const documents = request.file;
        
        const url = request.protocol + '://' + request.get('host');
        const formattedImageFileName = Date.now() + documents.originalname.split(' ').join('-');
        
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

        await sharp(documents.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedImageFileName);
        const imageUrl = url + '/' + imageDirectory + formattedImageFileName;
        const docCollection = {
            documents : imageUrl, docReqDate, docRegFollow, docReviewDate
        }
        const newDocCollection = new DocumentCollection(docCollection)
        await newDocCollection.save()
        response.status(201).json(newDocCollection)
    } catch (error) {
        next(error)
    }
}

export const docCollectionGetting = async (request, response, next) => {
    try {
        const documents = await DocumentCollection.find({})
        response.status(201).json(documents)
    }
    catch (error) {
        next(error)
    }
}