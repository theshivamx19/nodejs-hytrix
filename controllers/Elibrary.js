import Elibrary from '../models/Elibrary.js'
import fs from 'fs'
import sharp from 'sharp';

export const createElibrary = async (request, response, next) => {
    try {
        const data = request.body
        const { category, placeholder, label, date, description } = data
        const image = request.file
        const url = request.protocol + '://' + request.get('host');
        const formattedImageFileName = Date.now() + image.originalname.split(' ').join('-');

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

        await sharp(image.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedImageFileName);
        const imageUrl = url + '/' + imageDirectory + formattedImageFileName;
        const elibrary = {
            category, placeholder, label, date, description, image: imageUrl
        }
        const newElibrary = new Elibrary(elibrary)
        await newElibrary.save()
        response.status(201).json(newElibrary)
    } catch (error) {
        next(error)
    }
}


// export const elibraryGetting = async (request, respone, next) => {
//     try {
//         const elibraryData = await Elibrary.find({})
//         respone.status(200).json(elibraryData)
//     } catch (error) {
//         next(error)
//     }
// }


export const elibraryGetting = (request, response, next) => {
    try {
        const elibraryData = Elibrary.find({}).then(response => response).then(data => {
            data.map(item => {
                return response.json(item.label)
            })
        })
        // respone.status(200).json(elibraryData)
    } catch (error) {
        next(error)
    }
}


// then catch