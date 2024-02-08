import Expensedetails from '../../models/liseReg/ExpenseDetails.js'
import fs from 'fs'
import sharp from 'sharp';

export const createExpenseDetail = async (request, response, next) => {
    try {
        const data = request.body
        const { challlanFees, challanNumber, challanDate, directExpenses, status, company, executive, state, branch } = data
        const challanUpload = request.file;

        const url = request.protocol + '://' + request.get('host');
        const formattedImageFileName = Date.now() + challanUpload.originalname.split(' ').join('-');

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

        await sharp(challanUpload.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedImageFileName);
        const imageUrl = url + '/' + imageDirectory + formattedImageFileName;
        const expenseDetail = {
            challlanFees, challanNumber, challanDate, challanUpload: imageUrl, directExpenses, status, company, executive, state, branch
        }
        const newExpenseDetail = new Expensedetails(expenseDetail)
        await newExpenseDetail.save()
        response.status(201).json(newExpenseDetail)
    } catch (error) {
        next(error)
    }
}

export const expenseDetailGetting = async (request, response, next) => {
    try {
        const expenses = await Expensedetails.find({})
            .populate(company)
            .populate(executive)
            .populate(state)
            .populate(branch)
        const newArr = company.map(data => {
            return {
                challlanFees: data.challlanFees,
                challanNumber: data.challanNumber,
                challanUpload: data.challanUpload,
                directExpenses: data.directExpenses,
                status: data.status,
                company: data.company.name,
                executive: data.executive.name,
                state: data.state.name,
                branch: data.branch.name,
            }
        })
        response.status(201).json(newArr)
    }
    catch (error) {
        next(error)
    }
}