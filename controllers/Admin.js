import Admin from '../models/Admin.js';
import Category from '../models/Category.js';
import State from '../models/State.js'
import Branch from '../models/Branch.js';
import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import Compliance from '../models/Compliances.js';
import CheckList from '../models/CheckList.js';
import Notification from '../models/Notification.js';
import generateToken from '../utils/generateToken.js';
import Checkdata from '../models/CheckData.js'
import Elibrary from '../models/Elibrary.js'
import Audit from '../models/Audit.js';
import Lisereg from '../models/LiseReg.js';
import Company from '../models/Company.js'
import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';
import { response } from 'express';
import fs from 'node:fs'
import sharp from 'sharp';
import { List } from '../models/List.js';
import mongoose from 'mongoose';
import { uuid } from 'uuidv4';
import { log } from 'node:console';
const uniqueId = uuid()
// import Executive from '../models/Executive.js';


export const login = async (req, res, next) => {
    try {
        const user = await Admin.findOne({ email: req.body.email });

        if (!user) {
            //next(createError(404,"User Not Found!"));
            return res.send("404");
        }
        const passwordDB = user.password;
        const matchPasswotd = await bcryptjs.compare(req.body.password, passwordDB);
        if (matchPasswotd === false) {
            return res.send("400");
        }

        // now remove Password and isAdmin from User get from query as follows   
        //const { Password, isAdmin, ...otherDetails } = User;   
        //since in output of return response.json({...otherDetails}); I am getting collectable values in _doc variable so
        const { password, ...otherDetails } = user._doc;
        //now I have to install a jwt here. first install npm install jsonwebtoken and create jwt via openssl>rand -base64 32 and put it to .env file for privacy. And now create token with sign jwt token with user id and isadmin as
        const token = generateToken(user._id, 'login');//jwt.sign({id:user._id},process.env.JWT,{expiresIn:"2d"});

        //now put this token in a cookie by installing npm install cookie-parser. After this initialize this cookie-parser in index.js as app.use() and send back a cookie in response to browser with created token
        //res.cookie('access_token',token,{expire : 36000 + Date.now(), httpOnly:true}).status(200).json({...otherDetails});
        otherDetails.access_token = token;
        res.cookie('access_token', token, { maxAge: (2 * 24 * 60 * 60 * 1000) /* cookie will expires in 2 days*/, httpOnly: true }).status(201).json({ ...otherDetails });

    } catch (error) {
        //res.status(400).json({ message: error.message });
        next(error);
    }
}
export const logout = async (request, response, next) => {
    //response.clearCookie("access_token");
    const token = request.cookies.access_token;
    // console.log(token);//return;
    try {
        if (token) {
            response.clearCookie('access_token');
            response.status(201).json('Compliance Admin is Logged Out Successfully!!');
        }
        else {
            response.status(208).json('Compliance Admin is already Logged out successfully!!');
        }
    } catch (error) {
        // response.status(404).json({ message: error.message })
        next(error);
    }
}
export const catCreate = async (request, response, next) => {
    try {
        const name = await Category.findOne({ name: request.body.name });
        if (name) {
            return response.send("409");
        }
        const category = {
            name: request.body.name,
            dates: request.body.dates
        }

        const newCategory = new Category(category);
        await newCategory.save();
        response.status(201).json(newCategory);
    } catch (error) {
        // response.status(404).json({ message: 'error.message' })
        next(error);
    }
}
export const catGettting = async (request, response, next) => {
    try {
        const category = await Category.find({}).sort({ createdAt: -1 });
        console.log(category);
        response.status(201).json(category);
    } catch (error) {
        // response.status(404).json({ message: error.message })
        next(error);
    }
}
export const catEditById = async (request, response, next) => {
    //const{id,name} = request.body;
    return response.send(request.params.id); return
    //return response.send(id);
    try {
        const category = await Category.find();
        response.status(201).json(category);
    } catch (error) {
        // response.status(404).json({ message: error.message })
        next(error);
    }
}
// ------------------------ Create Compliance --------------------
export const createCompliances = async (request, response, next) => {

    try {
        const act = await Compliance.findOne({ act: request.body.act });
        if (act) {
            return response.send("409");
        }
        const data = request.body
        // console.log('documentUrl',documentUrl)
        const documentFile = request.files.document ? request.files.document[0] : null;
        const imageFile = request.files.image ? request.files.image[0] : null;
        const url = request.protocol + '://' + request.get('host');
        let imageUrl, formattedImageFileName
        let documentUrl, formattedDocumentFileName

        if (imageFile) {
            formattedImageFileName = Date.now() + imageFile.originalname.split(' ').join('-');
        }
        if (documentFile) {
            formattedDocumentFileName = Date.now() + documentFile.originalname.split(' ').join('-');
        }
        const uploadsDirectory = './data/uploads/';
        const imageDirectory = 'images/';
        const documentDirectory = 'documents/';

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

        // Ensure that the documents directory exists
        fs.access(uploadsDirectory + documentDirectory, (err) => {
            if (err) {
                fs.mkdirSync(uploadsDirectory + documentDirectory, { recursive: true });
            }
        });

        if (imageFile) {
            if (imageFile.mimetype.includes('image')) {
                await sharp(imageFile.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedImageFileName);
                imageUrl = url + '/' + imageDirectory + formattedImageFileName;
            }
            else if (imageFile.mimetype === 'application/pdf') {
                fs.writeFileSync(uploadsDirectory + imageDirectory + formattedImageFileName, imageFile.buffer);
                imageUrl = url + '/' + imageDirectory + formattedImageFileName;
            }
        }
        if (documentFile) {
            if (documentFile.mimetype === 'application/pdf') {
                fs.writeFileSync(uploadsDirectory + documentDirectory + formattedDocumentFileName, documentFile.buffer);
                documentUrl = url + '/' + documentDirectory + formattedDocumentFileName;
            }
        }
        const newArrDataRules = (data.rule).split("\r\n").map((data, i) => {
            return {
                id: i + 1,
                value: data
            }
        })
        const newArrDataQuestion = (data.question).split("\r\n").map((data, i) => {
            return {
                id: i + 1,
                value: data
            }
        })
        const newArrDataDescription = (data.description).split("\r\n").map((data, i) => {
            return {
                id: i + 1,
                value: data
            }
        })
        const compliance = {
            state: data.state,
            act: data.act,
            rule: data.rule,
            ruletype: newArrDataRules,
            category: data.category,
            question: data.question,
            questiontype: newArrDataQuestion,
            form: imageUrl,
            docattachment: documentUrl,
            formtype: data.formtype,
            docattachmenttype: data.docattachmenttype,
            compliancetype: data.compliancetype,
            frequency: data.frequency,
            risk: data.risk,
            description: data.description,
            descriptiontype: newArrDataDescription,
            executive: data.executive
        }
        //    console.log(compliance); 
        const newCompliance = new Compliance(compliance);
        await newCompliance.save();
        response.status(201).json(newCompliance);
    } catch (error) {
        // response.status(404).json({ message: 'error.message' })
        next(error);
    }
}




export const updateCompliancesById = async (request, response, next) => {
    try {

        const data = request.body

        const uploadsDirectory = './data/uploads/';
        const imageDirectory = 'images/';
        const documentDirectory = 'documents/';

        const documentFile = request.files.docattachment ? request.files.docattachment[0] : null;
        const imageFile = request.files.form ? request.files.form[0] : null;
        const url = request.protocol + '://' + request.get('host');
        let imageUrl, formattedImageFileName
        let documentUrl, formattedDocumentFileName

        if (imageFile) {
            formattedImageFileName = Date.now() + imageFile.originalname.split(' ').join('-');
        }
        if (documentFile) {
            formattedDocumentFileName = Date.now() + documentFile.originalname.split(' ').join('-');
        }
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

        // Ensure that the documents directory exists
        fs.access(uploadsDirectory + documentDirectory, (err) => {
            if (err) {
                fs.mkdirSync(uploadsDirectory + documentDirectory, { recursive: true });
            }
        });


        if (imageFile) {
            if (imageFile.mimetype.includes('image')) {
                await sharp(imageFile.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedImageFileName);
                imageUrl = url + '/' + imageDirectory + formattedImageFileName;
            }
            else if (imageFile.mimetype === 'application/pdf') {
                fs.writeFileSync(uploadsDirectory + imageDirectory + formattedImageFileName, imageFile.buffer);
                imageUrl = url + '/' + imageDirectory + formattedImageFileName;
            }
        }
        if (documentFile) {
            if (documentFile.mimetype === 'application/pdf') {
                fs.writeFileSync(uploadsDirectory + documentDirectory + formattedDocumentFileName, documentFile.buffer);
                documentUrl = url + '/' + documentDirectory + formattedDocumentFileName;
            }
        }
        const newArrDataRules = (data.rule).split("\r\n").map((data, i) => {
            return {
                id: i + 1,
                value: data
            }
        })
        const newArrDataQuestion = (data.question).split("\r\n").map((data, i) => {
            return {
                id: i + 1,
                value: data
            }
        })
        const newArrDataDescription = (data.description).split("\r\n").map((data, i) => {
            return {
                id: i + 1,
                value: data
            }
        })
        // let comliancelist = {};
        const comliancelist = {
            state: data.state,
            act: data.act,
            rule: data.rule,
            category: data.category,
            question: data.question,
            form: imageUrl,
            docattachment: documentUrl,
            compliancetype: data.compliancetype,
            frequency: data.frequency,
            risk: data.risk,
            description: data.description,
            duedate: data.duedate,
            executiveId: data.executiveId,
            status: data.status,
        }
        console.log(comliancelist);
        // const newComliancelistt = new Compliance(comliancelist)
        console.log(request.params.id);
        const updatedCompliance = await Compliance.updateOne({ _id: request.params.id }, comliancelist);
        // await newComliancelistt.save()
        response.status(201).json(updatedCompliance)
    }
    catch (error) {
        next(error)
    }
}



export const complianceGetting = async (request, response, next) => {
    try {
        const compliance = await Compliance.find({}).populate("category").populate('state')
        let newArr = compliance.map(data => {
            return {
                _id: data._id,
                state: data.state.name,
                act: data.act,
                rule: data.rule,
                category: data.category.name,
                question: data.question,
                form: data.form,
                docattachment: data.docattachment,
                compliancetype: data.compliancetype,
                frequency: data.frequency,
                description: data.description,
                risk: data.risk,
                duedate: data.duedate,
                status: data.status,
                created_at: data.created_at,
                updated_at: data.updated_at
            }
        })
        response.status(201).json(newArr)
    }
    catch (error) {
        next(error)
    }
}

// ----------------------------- Compliance Create Filter ------------------------------------

export const complianceFilter = async (request, response, next) => {
    try {
        const stateFilter = request.body.state;
        const dateFilter = request.body.created_at;
        console.log(request.body);
        const matchStage = {};

        if (stateFilter !== undefined && dateFilter !== undefined && stateFilter !== "" && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            const dateObject = new Date(dateFilter); // taking user data 2024-05-20 and converting to mongodb iso date
            const nextDay = new Date(dateObject); // now dateobject have date as iso date and saving again it to nexday
            nextDay.setDate(dateObject.getDate() + 1); // then extracting date and adding 1 to it bcz $lt used
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        } else if (stateFilter !== undefined && stateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());;
        } else if (dateFilter !== undefined && dateFilter !== "") {
            // Only createdAt is provided
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        const filter = await Compliance.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $project: {
                    _id: 1,
                    act: 1,
                    rule: 1,
                    form: 1,
                    docattachment: 1,
                    compliancetype: 1,
                    question: 1,
                    description: 1,
                    frequency: 1,
                    risk: 1,
                    duedate: 1,
                    status: 1,
                    created_at: 1,
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                }
            }
        ]);

        response.status(201).json({ message: "Total = " + filter.length, data: filter });
    } catch (error) {
        next(error);
    }
};

// ---------------------------Compliance Approve Filter ----------------------------

export const complianceApproveFilter = async (request, response, next) => {
    try {  // status : 0
        const stateFilter = request.body.state;
        const executiveFilter = request.body.executive;
        const dateFilter = request.body.created_at;
        console.log(stateFilter, executiveFilter, dateFilter)
        const matchStage = {};

        if (stateFilter !== undefined && dateFilter !== undefined && executiveFilter !== undefined && stateFilter !== "" && dateFilter !== "" && executiveFilter !== "") {
            console.log("you are  in all");

            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        } else if (stateFilter !== undefined && stateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());;
        } else if (dateFilter !== undefined && dateFilter !== "") {
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (executiveFilter !== undefined && executiveFilter !== "") {
            console.log("you are  in executive");
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        }

        const filter = await Compliance.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "executive",
                    foreignField: "_id",
                    as: "executiveData",
                },
            },
            {
                $project: {
                    _id: 1,
                    act: 1,
                    rule: 1,
                    form: 1,
                    docattachment: 1,
                    // compliancetype : 1,
                    // question : 1,
                    // description : 1,
                    // frequency : 1,
                    // risk : 1,
                    // duedate : 1,
                    // status : 1,
                    created_at: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                }
            }
        ]);
        console.log(filter);
        response.status(201).json(filter);

    } catch (error) {
        next(error);
    }
};

// -------------------------------Compliance Rejected Filter -------------------------------

export const complianceRejectedFilter = async (request, response, next) => {
    try {
        const stateFilter = request.body.state;
        const executiveFilter = request.body.executive;
        const updatedFilter = request.body.updated_at;
        const rejectedFilter = request.body.rejected_at;

        const matchStage = {};
        matchStage['status'] = { $eq: 2 }
        if (stateFilter !== undefined && executiveFilter !== undefined && updatedFilter !== undefined && rejectedFilter !== undefined && stateFilter !== "" && executiveFilter !== "" && updatedFilter !== "" && rejectedFilter !== "") {
            // Both state and createdAt are provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

            const updatedDateObject = new Date(updatedFilter);
            const updatedNextDay = new Date(updatedDateObject);
            updatedNextDay.setDate(updatedDateObject.getDate() + 1);
            matchStage['updated_at'] = {
                $gte: updatedDateObject,
                $lt: updatedNextDay
            };
            const dateObject = new Date(rejectedFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['rejected_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        // ---------------------- 3 Filter ------------------------------
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && updatedFilter !== undefined && updatedFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

            const updatedDateObject = new Date(updatedFilter);
            const updatedNextDay = new Date(updatedDateObject);
            updatedNextDay.setDate(updatedDateObject.getDate() + 1);
            matchStage['updated_at'] = {
                $gte: updatedDateObject,
                $lt: updatedNextDay
            };

        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && rejectedFilter !== undefined && rejectedFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

            const dateObject = new Date(rejectedFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['rejected_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && updatedFilter !== undefined && updatedFilter !== "" && rejectedFilter !== undefined && rejectedFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());

            const updatedDateObject = new Date(updatedFilter);
            const updatedNextDay = new Date(updatedDateObject);
            updatedNextDay.setDate(updatedDateObject.getDate() + 1);
            matchStage['updated_at'] = {
                $gte: updatedDateObject,
                $lt: updatedNextDay
            };
            const dateObject = new Date(rejectedFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['rejected_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && updatedFilter !== undefined && updatedFilter !== "" && rejectedFilter !== undefined && rejectedFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

            const updatedDateObject = new Date(updatedFilter);
            const updatedNextDay = new Date(updatedDateObject);
            updatedNextDay.setDate(updatedDateObject.getDate() + 1);
            matchStage['updated_at'] = {
                $gte: updatedDateObject,
                $lt: updatedNextDay
            };
            const dateObject = new Date(rejectedFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['rejected_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        // ---------------------- 2 Filter -----------------------------------

        else if (executiveFilter !== undefined && executiveFilter !== "" && stateFilter !== undefined && stateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

        }
        else if (updatedFilter !== undefined && updatedFilter !== "" && stateFilter !== undefined && stateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());

            const updatedDateObject = new Date(updatedFilter);
            const updatedNextDay = new Date(updatedDateObject);
            updatedNextDay.setDate(updatedDateObject.getDate() + 1);
            matchStage['updated_at'] = {
                $gte: updatedDateObject,
                $lt: updatedNextDay
            };

        }
        else if (rejectedFilter !== undefined && rejectedFilter !== "" && stateFilter !== undefined && stateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());

            const dateObject = new Date(rejectedFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['rejected_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && updatedFilter !== undefined && updatedFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

            const updatedDateObject = new Date(updatedFilter);
            const updatedNextDay = new Date(updatedDateObject);
            updatedNextDay.setDate(updatedDateObject.getDate() + 1);
            matchStage['updated_at'] = {
                $gte: updatedDateObject,
                $lt: updatedNextDay
            };

        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && rejectedFilter !== undefined && rejectedFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

            const dateObject = new Date(rejectedFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['rejected_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (updatedFilter !== undefined && updatedFilter !== "" && rejectedFilter !== undefined && rejectedFilter !== "") {

            const updatedDateObject = new Date(updatedFilter);
            const updatedNextDay = new Date(updatedDateObject);
            updatedNextDay.setDate(updatedDateObject.getDate() + 1);
            matchStage['updated_at'] = {
                $gte: updatedDateObject,
                $lt: updatedNextDay
            };
            const dateObject = new Date(rejectedFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['rejected_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        else if (stateFilter !== undefined && stateFilter !== "") {
            // Only state is provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());;
        } else if (updatedFilter !== undefined && updatedFilter !== "") {
            // Only createdAt is provided
            const updatedDateObject = new Date(updatedFilter);
            const updatedNextDay = new Date(updatedDateObject);
            updatedNextDay.setDate(updatedDateObject.getDate() + 1);
            matchStage['updated_at'] = {
                $gte: updatedDateObject,
                $lt: updatedNextDay
            };
        } else if (rejectedFilter !== undefined && rejectedFilter !== "") {
            // Only createdAt is provided
            const dateObject = new Date(rejectedFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['rejected_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        }

        // console.log(matchStage);
        const filter = await Compliance.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "executive",
                    foreignField: "_id",
                    as: "executiveData",
                },
            },
            {
                $project: {
                    _id: 1,
                    act: 1,
                    rule: 1,
                    form: 1,
                    docattachment: 1,
                    updated_at: 1,
                    rejected_at: 1,
                    compliancetype: 1,
                    question: 1,
                    description: 1,
                    frequency: 1,
                    risk: 1,
                    duedate: 1,
                    status: 1,
                    created_at: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                }
            }
        ]);

        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
};

// -------------------------------User Creation ----------------------------->

export const userCreate = async (request, response, next) => {
    try {
        const data = request.body
        const user = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            password: data.password,
        }
        const hashedPass = await bcrypt.hash(data.password, 10)
        user.password = hashedPass;
        const newUser = new User(user)
        await newUser.save()
        response.status(201).json(newUser)
    }
    catch (error) {
        next(error)
    }
}

export const userGetting = async (request, response, next) => {
    try {
        const user = await User.find({})
        response.status(201).json(user)
    }
    catch (error) {
        next(error)
    }
}


// ------------------------------------Create State -------------------------------

export const stateCreate = async (request, response, next) => {
    try {
        const data = request.body
        const newState = new State(data);
        await newState.save()
        response.status(201).json(newState)
    }
    catch (error) {
        next(error)
    }
}

// --------------------------------Create CheckList----------------------------------

export const checkListCreate = async (request, response, next) => {
    try {
        const data = request.body
        const documentFile = request.files.documents[0];
        const imageFile = request.files.image[0];
        const url = request.protocol + '://' + request.get('host');


        const formattedImageFileName = Date.now() + imageFile.originalname.split(' ').join('-');
        const formattedDocumentFileName = Date.now() + documentFile.originalname.split(' ').join('-');


        const uploadsDirectory = './data/uploads/';
        const imageDirectory = 'images/';
        const documentDirectory = 'documents/';

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

        // Ensure that the documents directory exists
        fs.access(uploadsDirectory + documentDirectory, (err) => {
            if (err) {
                fs.mkdirSync(uploadsDirectory + documentDirectory, { recursive: true });
            }
        });
        // await sharp(request.file.buffer).resize({ width: 600 }).toFile('./data/uploads/' + formattedFileName);
        // const profileImage = url + '/' + formattedFileName;

        await sharp(imageFile.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedImageFileName);
        const imageUrl = url + '/' + imageDirectory + formattedImageFileName;
        fs.writeFileSync(uploadsDirectory + documentDirectory + formattedDocumentFileName, documentFile.buffer);
        const documentUrl = url + '/' + documentDirectory + formattedDocumentFileName;

        // }
        const checklist = {
            state: data.state,
            act: data.act,
            rule: data.rule,
            category: data.category,
            status: data.status,
            image: imageUrl,
            documents: documentUrl,
            form: data.form,
            compliances: data.compliances,
            risk: data.risk,
            executive: data.executive,
            branchname: data.branchname
        }
        // console.log(checklist); return
        const newCheckList = new CheckList(checklist)
        await newCheckList.save()
        response.status(201).json(newCheckList)
    }
    catch (error) {
        next(error)
    }
}

export const checkListGetting = async (request, response, next) => {
    try {
        const checklist = await CheckList.find({}).populate('category')
        // console.log(checklist);
        // const data = {}
        // data = {
        //     compliance : checklist.compliance.act
        // }
        response.status(201).json(checklist)
    }
    catch (error) {
        next(error)
    }
}

// ------------------------------- Checklist All Filter-------------------------------------
export const checkListAllFilter = async (request, response, next) => {
    try {

        const stateFilter = request.body.state;
        const companyFilter = request.body.company;
        const executiveFilter = request.body.executive;
        const dateFilter = request.body.date;
        const adminFilter = request.body.admin

        const matchStage = {};
        matchStage['status'] = { $eq: 0 }
        if (stateFilter !== undefined && dateFilter !== undefined && executiveFilter !== undefined && companyFilter !== undefined && stateFilter !== "" && dateFilter !== "" && executiveFilter !== "" && companyFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && companyFilter !== undefined && companyFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && companyFilter !== undefined && companyFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && companyFilter !== undefined && companyFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && stateFilter !== undefined && stateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (dateFilter !== undefined && dateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (dateFilter !== undefined && dateFilter !== "" && companyFilter !== undefined && companyFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (dateFilter !== undefined && dateFilter !== "" && stateFilter !== undefined && stateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        else if (companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (companyFilter !== undefined && companyFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (companyFilter !== undefined && companyFilter !== "" && stateFilter !== undefined && stateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (stateFilter !== undefined && stateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());;
        }
        else if (executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        }
        else if (companyFilter !== undefined && companyFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (adminFilter !== undefined && adminFilter !== "") {
            // matchStage['admin'] = "659d4f2609c9923c9e7b8f72"
            matchStage['admin'] = new mongoose.Types.ObjectId("659d4f2609c9923c9e7b8f72")

        }
        else if (dateFilter !== undefined && dateFilter !== "") {
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        const filter = await CheckList.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "executive",
                    foreignField: "_id",
                    as: "executiveData",
                },
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "companyData",
                },
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branchname",
                    foreignField: "_id",
                    as: "branchData",
                },
            },
            {
                $lookup: {
                    from: "admins",
                    localField: "admin",
                    foreignField: "_id",
                    as: "adminData",
                },
            },
            {
                $project: {
                    _id: 1,
                    state: 1,
                    branchname: 1,
                    approvedate: 1,
                    date: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.companyname", 0] },
                    branchname: { $arrayElemAt: ["$branchData.name", 0] },
                    admin: { $arrayElemAt: ["$adminData.name", 0] },
                }
            }
        ]);

        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
};

// ------------------------------- Checklist Approve Filter----------------------------------
export const checkListApproveFilter = async (request, response, next) => {
    try {

        const stateFilter = request.body.state;
        const companyFilter = request.body.company;
        const executiveFilter = request.body.executive;
        const branchFilter = request.body.branchname;
        const dateFilter = request.body.created_at;

        const matchStage = {};
        matchStage['status'] = { $eq: 1 }

        if (stateFilter !== undefined && dateFilter !== undefined && executiveFilter !== undefined && companyFilter !== undefined && branchFilter !== undefined && stateFilter !== "" && dateFilter !== "" && executiveFilter !== "" && companyFilter !== "" && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        // ------------- 4 Filter -----------------
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        // ------------ 3 Filter --------------
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            // Both state and createdAt are provided
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        // ------------------ 2 Filter ----------------

        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (stateFilter !== undefined && stateFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (stateFilter !== undefined && stateFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            // Only state is provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        }
        else if (companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString());
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString());
        }
        else if (companyFilter !== undefined && companyFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString());
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        // ------------------ 1 Filter ----------------------
        else if (stateFilter !== undefined && stateFilter !== "") {
            // Only state is provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        }
        else if (companyFilter !== undefined && companyFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (branchFilter !== undefined && branchFilter !== "") {
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
        }
        else if (dateFilter !== undefined && dateFilter !== "") {

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }


        // console.log(matchStage);
        const filter = await CheckList.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "executive",
                    foreignField: "_id",
                    as: "executiveData",
                },
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "companyData",
                },
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branchname",
                    foreignField: "_id",
                    as: "branchData",
                },
            },
            {
                $lookup: {
                    from: "compliances",
                    localField: "compliance",
                    foreignField: "_id",
                    as: "complianceData",
                },
            },
            {
                $project: {
                    _id: 1,
                    approvedate: 1,
                    status: 1,
                    image: 1,
                    documents: 1,
                    risk: 1,
                    created_at: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.name", 0] },
                    branchname: { $arrayElemAt: ["$branchData.name", 0] },
                    compliance: { $arrayElemAt: ["$complianceData.act", 0] },
                }
            }

        ]);

        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
};

// ------------------------------------- Checklist Create Filter-----------------------------------

export const checkListCreateFilter = async (request, response, next) => {
    try {

        const stateFilter = request.body.state;
        const companyFilter = request.body.company;
        const branchFilter = request.body.branchname;
        const dateFilter = request.body.created_at;

        const matchStage = {};

        if (stateFilter !== undefined && dateFilter !== undefined && companyFilter !== undefined && branchFilter !== undefined && stateFilter !== "" && dateFilter !== "" && companyFilter !== "" && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }


        // ------------ 3 Filter --------------

        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        else if (stateFilter !== undefined && stateFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        else if (companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            // Both state and createdAt are provided
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        // ------------------ 2 Filter ----------------

        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }

        else if (stateFilter !== undefined && stateFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (stateFilter !== undefined && stateFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            // Only state is provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        else if (companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString());
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString());
        }
        else if (companyFilter !== undefined && companyFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString());
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        else if (branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        // ------------------ 1 Filter ----------------------
        else if (stateFilter !== undefined && stateFilter !== "") {
            // Only state is provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (companyFilter !== undefined && companyFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (branchFilter !== undefined && branchFilter !== "") {
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
        }
        else if (dateFilter !== undefined && dateFilter !== "") {

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }


        // console.log(matchStage);
        const filter = await CheckList.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "executive",
                    foreignField: "_id",
                    as: "executiveData",
                },
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "companyData",
                },
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branchname",
                    foreignField: "_id",
                    as: "branchData",
                },
            },
            {
                $lookup: {
                    from: "compliances",
                    localField: "compliance",
                    foreignField: "_id",
                    as: "complianceData",
                },
            },
            {
                $project: {
                    _id: 1,
                    approvedate: 1,
                    status: 1,
                    image: 1,
                    documents: 1,
                    risk: 1,
                    created_at: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.name", 0] },
                    branchname: { $arrayElemAt: ["$branchData.name", 0] },
                    compliance: { $arrayElemAt: ["$complianceData.act", 0] },
                }
            }

        ]);

        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
};

// --------------------------------- Checklist Rejected Filter-----------------------------------------
export const checkListRejectedFilter = async (request, response, next) => {
    try {

        const stateFilter = request.body.state;
        const companyFilter = request.body.company;
        const executiveFilter = request.body.executive;
        const branchFilter = request.body.branchname;
        const dateFilter = request.body.date;
        console.log(stateFilter, companyFilter, executiveFilter, branchFilter, dateFilter);

        const matchStage = {};
        matchStage['status'] = { $eq: 2 }
        if (stateFilter !== undefined && dateFilter !== undefined && executiveFilter !== undefined && companyFilter !== undefined && branchFilter !== undefined && stateFilter !== "" && dateFilter !== "" && executiveFilter !== "" && companyFilter !== "" && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        // ------------- 4 Filter -----------------
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        // ------------ 3 Filter --------------
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            // Both state and createdAt are provided
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        // ------------------ 2 Filter ----------------

        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (stateFilter !== undefined && stateFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (stateFilter !== undefined && stateFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            // Only state is provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        }
        else if (companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString());
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString());
        }
        else if (companyFilter !== undefined && companyFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            console.log("i'm in company and date");
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString());
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        // ------------------ 1 Filter ----------------------
        else if (stateFilter !== undefined && stateFilter !== "") {
            // Only state is provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        }
        else if (companyFilter !== undefined && companyFilter !== "") {
            console.log("i'm in company");
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (branchFilter !== undefined && branchFilter !== "") {
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
        }
        else if (dateFilter !== undefined && dateFilter !== "") {

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['date'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }


        // console.log(matchStage);
        const filter = await CheckList.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "executive",
                    foreignField: "_id",
                    as: "executiveData",
                },
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "companyData",
                },
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branchname",
                    foreignField: "_id",
                    as: "branchData",
                },
            },
            {
                $lookup: {
                    from: "compliances",
                    localField: "compliance",
                    foreignField: "_id",
                    as: "complianceData",
                },
            },
            {
                $project: {
                    _id: 1,
                    approvedate: 1,
                    status: 1,
                    image: 1,
                    documents: 1,
                    risk: 1,
                    date: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.name", 0] },
                    branchname: { $arrayElemAt: ["$branchData.name", 0] },
                    compliance: { $arrayElemAt: ["$complianceData.act", 0] },
                }
            }

        ]);

        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
};



export const createPosts = async (req, res) => {

    // console.log(req.file,'-----'); return;
    const email = await postMessages.findOne({ email: req.body.email });
    if (email) {
        return res.send("409");
    }
    const requestBody = req.body;
    const salt = await bcryptjs.genSaltSync(10);
    const passhash = await bcryptjs.hashSync(requestBody.Password, salt);
    try {

        const url = req.protocol + '://' + req.get('host');
        const formattedFileName = Date.now() + req.file.originalname.split(' ').join('-'); //replace space with -

        fs.access('./data/uploads', (err) => {
            if (err) {
                fs.mkdirSync('./data/uploads', { recursive: true });// {recursive: true}, (err) => {});   //it will creates './data/uploads' folder
            }
        });

        await sharp(req.file.buffer).resize({ width: 600 }).toFile('./data/uploads/' + formattedFileName);
        const profileImage = url + '/' + formattedFileName;
        const user = {
            Name: requestBody.Name,
            Occupation: requestBody.Occupation,
            Email: requestBody.Email,
            Password: passhash,
            Phone: requestBody.Phone,
            Description: requestBody.Description,
            isAdmin: requestBody.isAdmin,
            //  Image:requestBody.Email+'-'+req.file.originalname    ////from cloudinary cloud
            Image: profileImage
        };
        //console.log(requestBody); return;
        const newUser = new postMessages(user);
        await newUser.save();
        res.status(201).json(newUser);   ////if data saved properly then code 201
    } catch (error) {
        res.status(409).json({ message: error.message }); ////if data saved fails  then code 409
    }

}



export const checkListFilter = async (request, response, next) => {
    try {
        const stateFilter = request.query.state;
        const dateFilter = request.query.createdAt;

        console.log(request.query);
        const matchStage = {};

        if (stateFilter !== undefined && dateFilter !== undefined) {
            // Both state and createdAt are provided
            matchStage['state'] = stateFilter;

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['createdAt'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        } else if (stateFilter !== undefined) {
            // Only state is provided
            matchStage['state'] = stateFilter;
        } else if (dateFilter !== undefined) {
            // Only createdAt is provided
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['createdAt'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        const filter = await CheckList.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "dataresult",
                },
            },
            {
                $unwind: "$dataresult",
            },
        ]);

        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
};

export const checkListFind = async (request, response, next) => {
    try {
        const getAllCheckList = await CheckList.find({})
            .populate('category', 'name')
            .populate('state', 'name')
            .populate('branchname', 'name')
            .populate('executive', 'firstName lastName')
            .populate('compliances', 'act');

        const newArr = getAllCheckList.map((data) => {
            return {
                _id: data._id,
                state: data.state.name,
                act: data.act,
                rule: data.rule,
                category: data.category.name,
                status: data.status,
                image: data.image,
                documents: data.documents,
                compliances: data.compliances.act,
                executive: data.executive.firstName + " " + data.executive.lastName,
                branchname: data.branchname.name,
                risk: data.risk,
                approvedate: data.approvedate,
                date: data.date,
            }
        })
        response.status(200).json(newArr)
    }
    catch (error) {
        next(error);
    }
}

// .populate('category').populate('state').populate('branchname').populate('executive').populate('compliances')
// let arrData = []
// const arrData = getAllCheckList.map(data => {
//    if(data.category || data.state){
//     return data.category = data.category.name
//    }
// //    else if(data.state){
// //     return data.state = data.state.name
// //    }
// })

// const { categoryId, stateId, branchId, executiveId, complianceId, companyId } = data
// let newData = {}

// if (categoryId) {
//     const checkCatId = await CheckList.findOne({ category: categoryId }).populate('category')
//     if (!checkCatId) {
//         response.status(400).json("Give category id not exists")
//     }
//     else
//         newData.catName = checkCatId.category.name
// }
// if (stateId) {
//     const checkStateId = await CheckList.findOne({ state: stateId }).populate('state')
//     if (!checkStateId) {
//         response.status(400).json("Given state id not exists")
//     }
//     else
//         newData.stateName = checkStateId.state.name
// }
// if (branchId) {
//     const checkBranchId = await CheckList.findOne({ branchname: branchId }).populate('branchname')
//     if (!checkBranchId) {
//         response.status(400).json("Given branch id not exists")
//     }
//     else
//         newData.branchName = checkBranchId.branchname.name
// }
// if (executiveId) {
//     const checkExecId = await CheckList.findOne({ executive: executiveId }).populate('executive')
//     if (!checkExecId) {
//         response.status(400).json("Given executive id not exists")
//     }
//     else
//         newData.execName = checkExecId.executive.firstName + " " + checkExecId.executive.lastName
// }
// console.log(newData);

// if (complianceId) {
//     const checkComplianceId = await CheckList.findOne({ compliances: complianceId }).populate('compliances')
//     if (!checkComplianceId) {
//         response.status(400).json("Given compliances id not exists")
//     }
//     else
//         newData.complianceName = checkComplianceId.compliances.act
// }


// export const checkListFind = async (request, response, next) => {
//     try {
//         const data = request.body;
//         const { categoryId, stateId, branchId, executiveId, complianceId, companyId } = data;

//         let newData = {};

//         const checkList = await CheckList.findOne({
//             $and: [
//                 { category: categoryId },
//                 { state: stateId },
//                 { branchname: branchId },
//                 { executive: executiveId },
//                 { compliances: complianceId },
//             ],
//         })
//             .populate('category', 'name')
//             .populate('state', 'name')
//             .populate('branchname', 'name')
//             .populate('executive', 'firstName lastName')
//             .populate('compliances', 'act');

//         if (!checkList) {
//             response.status(400).json("No matching records found");
//             return;
//         }

//         newData.catName = checkList.category ? checkList.category.name : null;
//         newData.stateName = checkList.state ? checkList.state.name : null;
//         newData.branchName = checkList.branchname ? checkList.branchname.name : null;
//         newData.execName = checkList.executive ? `${checkList.executive.firstName} ${checkList.executive.lastName}` : null;
//         newData.compName = checkList.compliances ? checkList.compliances.act : null;
//         console.log(newData);

//         response.status(200).json(newData);
//     } catch (error) {
//         next(error);
//     }
// };

//  ** Branch **

export const createBranch = async (request, response, next) => {
    try {
        const name = request.body.name
        const branch = {
            name
        }
        const newBranch = new Branch(branch)
        await newBranch.save()
        response.status(201).json(newBranch)
    }
    catch (error) {
        next(error)
    }
}

export const branchGetting = async (request, response, next) => {
    try {
        const branches = await Branch.find({})
        response.status(200).json(branches)
    }
    catch (error) {
        next(error)
    }
}

//  ** Notification **

export const createNotification = async (request, response, next) => {
    try {
        const notification = {
            label,
            role,
            description,
            externallinks,
            image,
            isread,
            dates
        }
        const newNotification = new Notification(notification)
        await newNotification.save()
    }
    catch (error) {
        next(error)
    }
}

export const notificationGetting = async (request, response, next) => {
    try {
        const notifications = await Notification.find({})
        response.status(200).json(notifications)
    }
    catch (error) {
        next(error)
    }
}

//  ** Executive **

// export const createExecutive = async (request, response, next) => {
//     try {
//         const data = request.body
//         const { name, email, userType, password, mobile, status, image } = data
//         const executive = {
//             name: name, email: email, userType: userType, password: password, mobile: mobile, status: status, image: image
//         }
//         const newExecutive = new Executive(executive)
//         await newExecutive.save()
//         response.status(201).json(newExecutive)
//     }
//     catch (error) {
//         next(error)
//     }
// }

// export const executiveGetting = async (request, response, next) => {
//     try {
//         const executives = await Executive.find({})
//         response.status(200).json(executives)
//     }
//     catch (error) {
//         next(error)
//     }
// }

// ----------------------------------------- List ------------------------------------------
export const addlist = async (request, response, next) => {
    try {
        const data = request.body
        const createList = await List.create(data)
        response.status(201).json(createList)
    } catch (error) {
        next(error)
    }
}

export const checkData = async (request, response, next) => {
    try {
        const data = request.body
        const { name, age } = data
        // console.log(data);
        const newArrData = name.map((data, i) => {
            return {
                _id: i + 1,
                value: data.value
            }
        })
        console.log(newArrData);
        const userData = {
            name: newArrData, age
        }
        const newUserData = new Checkdata(userData)
        await newUserData.save()
        response.status(201).json(newUserData)
    } catch (error) {
        next(error)
    }
}

export const getCheckData = async (request, response, next) => {
    try {
        const userData = await Checkdata.find({})
        response.status(200).json(userData)
    } catch (error) {
        next(error)
    }
}

export const checklistOnCreateegetting = async (request, response, next) => {
    try {
        const newArr = await CheckList.aggregate([
            {
                $match: { status: { $eq: 0 } }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "compliances",
                    localField: "compliance",
                    foreignField: "_id",
                    as: "complianceData",
                },
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branchname",
                    foreignField: "_id",
                    as: "branchData",
                },
            },
            {
                $project: {
                    _id: 1,
                    category: 1,
                    company: 1,
                    branchname: 1,
                    compliance: 1,
                    rule: 1,
                    question: 1,
                    description: 1,
                    image: 1,
                    documents: 1,
                    frequency: 1,
                    risk: 1,
                    created_at: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.name", 0] },
                    branchname: { $arrayElemAt: ["$branchData.name", 0] },
                    compliance: { $arrayElemAt: ["$complianceData.act", 0] },
                }
            }
        ])

        // const checklist = await CheckList.find({ status: { $eq: 0 } } ).populate("category").populate('state').populate('compliance',"act").populate('branchname')


        // let newArr = checklist.map(data => {
        //     return {
        //         _id: data._id,
        //         state: data.state.name,
        //         category: data.category.name,
        //         company:data.company,  
        //         executive: data.executive,
        //         branchname:data.branchname.name,  
        //         compliance: data.compliance.act,
        //         rule: data.rule,
        //         question: data.question,
        //         description:data.description,
        //         image: data.image,
        //         documents: data.documents,
        //         frequency:data.frequency,
        //         risk: data.risk,
        //         created_at:data.created_at,
        //     }
        // })
        console.log(newArr)
        response.status(201).json(newArr)
    }
    catch (error) {
        next(error)
    }
}







export const checklistApprovegetting = async (request, response, next) => {
    try {
        // const compliance = await Compliance.find({ $and: [ { status: { $eq: 0 } }, { executive: { $ne: '659d4f2609c9923c9e7b8f72' } } ] }).populate("category").populate('state')
        const matchStage = {}
        // matchStage['status'] = {$eq : 0}
        // matchStage['executive'] = { $ne: new mongoose.Types.ObjectId("659d4f2609c9923c9e7b8f72") }
        // console.log(matchStage);
        const newArr = await CheckList.aggregate([
            {
                $match: {
                    $and: [
                        { status: { $eq: 0 } },
                        { executive: { $ne: new mongoose.Types.ObjectId("659d4f2609c9923c9e7b8f72") } }
                    ]
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "compliances",
                    localField: "compliance",
                    foreignField: "_id",
                    as: "complianceData",
                },
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branchname",
                    foreignField: "_id",
                    as: "branchData",
                },
            },
            {
                $project: {
                    _id: 1,
                    category: 1,
                    company: 1,
                    branchname: 1,
                    compliance: 1,
                    rule: 1,
                    question: 1,
                    description: 1,
                    image: 1,
                    documents: 1,
                    frequency: 1,
                    risk: 1,
                    created_at: 1,
                    approvedate: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.name", 0] },
                    branchname: { $arrayElemAt: ["$branchData.name", 0] },
                    compliance: { $arrayElemAt: ["$complianceData.act", 0] },
                }
            }
        ])
        // const checklist = await CheckList.find({ $and: [ { status: { $eq: 0 } }, { executive: { $ne: '659d4f2609c9923c9e7b8f72' } } ] }).populate("category").populate('state').populate('compliance',"act").populate('branchname')
        // let newArr = checklist.map(data => {
        //     return {
        //         _id: data._id,
        //         state: data.state.name,
        //         category: data.category.name,
        //         company:data.company,  
        //         executive: data.executive,
        //         branchname:data.branchname.name,  
        //         compliance: data.compliance.act,
        //         rule: data.rule,
        //         question: data.question,
        //         description:data.description,
        //         image: data.image,
        //         documents: data.documents,
        //         frequency:data.frequency,
        //         risk: data.risk,
        //         approvedate: data.approvedate,
        //         created_at:data.created_at,
        //     }
        // })
        // console.log(checklist)
        response.status(201).json(newArr)
    }
    catch (error) {
        next(error)
    }
}
export const checklistOnRejectegetting = async (request, response, next) => {
    try {
        const newArr = await CheckList.aggregate([
            {
                $match: {
                    status: { $eq: 2 }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "compliances",
                    localField: "compliance",
                    foreignField: "_id",
                    as: "complianceData",
                },
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branchname",
                    foreignField: "_id",
                    as: "branchData",
                },
            },
            {
                $project: {
                    _id: 1,
                    category: 1,
                    company: 1,
                    branchname: 1,
                    compliance: 1,
                    rule: 1,
                    question: 1,
                    description: 1,
                    image: 1,
                    documents: 1,
                    frequency: 1,
                    risk: 1,
                    created_at: 1,
                    rejected_at: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.name", 0] },
                    branchname: { $arrayElemAt: ["$branchData.name", 0] },
                    compliance: { $arrayElemAt: ["$complianceData.act", 0] },
                }
            }
        ])

        // const checklist = await CheckList.find({ status: { $eq: 2 } }).populate("category").populate('state').populate('compliance', "act").populate('branchname')
        // let newArr = checklist.map(data => {
        //     return {
        //         _id: data._id,
        //         state: data.state.name,
        //         category: data.category.name,
        //         company: data.company,
        //         executive: data.executive,
        //         branchname: data.branchname.name,
        //         compliance: data.compliance.act,
        //         rule: data.rule,
        //         question: data.question,
        //         description: data.description,
        //         image: data.image,
        //         documents: data.documents,
        //         frequency: data.frequency,
        //         risk: data.risk,
        //         rejected_at: data.rejected_at,
        //     }
        // })
        console.log(newArr)
        response.status(201).json(newArr)
    }
    catch (error) {
        next(error)
    }
}



export const gettingCompliances = async (request, response, next) => { /////////this is when getting on approve compliance page
    try {
        const newArr = await Compliance.aggregate([
            {
                $match: {
                    $and: [
                        { status: { $eq: 0 } },
                        { executive: { $ne: new mongoose.Types.ObjectId("659d4f2609c9923c9e7b8f72") } }
                    ]
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "executive",
                    foreignField: "_id",
                    as: "executiveData",
                },
            },
            {
                $project: {
                    _id: 1,
                    compliance: 1,
                    rule: 1,
                    question: 1,
                    description: 1,
                    form: 1,
                    docattachment: 1,
                    compliancetype: 1,
                    description: 1,
                    frequency: 1,
                    risk: 1,
                    status: 1,
                    created_at: 1,
                    updated_at: 1,
                    duedate: 1,
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                }
            }
        ])
        console.log(newArr)
        response.status(201).json({ message: "Total : " + newArr.length, data: newArr })
        // const compliance = await Compliance.find({ $and: [ { status: { $eq: 0 } }, { executive: { $ne: '659d4f2609c9923c9e7b8f72' } } ] }).populate("category").populate('state').populate("executive")
        // let newArr = compliance.map(data => {
        //     return {
        //         _id: data._id,
        //         state: data.state.name,
        //         act: data.act,
        //         rule: data.rule,
        //         category: data.category.name,
        //         question: data.question,
        //         form: data.form,
        //         docattachment: data.docattachment,
        //         compliancetype: data.compliancetype,
        //         frequency: data.frequency,
        //         description: data.description,
        //         risk: data.risk,
        //         duedate: data.duedate,
        //         status: data.status,
        //         // executive:data.executive.firstName+' '+data.executive.lastName,
        //         created_at: data.created_at,
        //         updated_at: data.updated_at
        //     }
        // })
        // response.status(201).json(newArr)
    }
    catch (error) {
        next(error)
    }
}




// ---------------------- Audit ------------------------------------

export const gettingAuditor = async (request, response, next) => {
    try {
        // const auditor = await User.find( {role : {$eq : "Auditor"}})
        const auditor = await User.aggregate([
            {
                $match: {
                    role: { $eq: "Auditor" }
                }
            }
        ])
        response.status(200).json(auditor)
    } catch (error) {
        next(error)
    }
}
export const gettingChecklist = async (request, response, next) => {
    try {
        // const checklist = await CheckList.find({})
        const checklist = await CheckList.aggregate([
            {
                $match: {
                    status: 2
                }              // $match : {} this will fetch the all the documents
            },
            {
                $project: {
                    _id: 1
                }
            }
        ])
        response.status(200).json(checklist)
    } catch (error) {
        next(error)
    }
}

export const createAudit = async (request, response, next) => {
    try {
        const data = request.body
        const { title, company, branch, state, executive, auditor, scope, briefauditor, checkboxlist, auditstatus, status, risk, start_date, end_date } = data
        const audit = {
            title, company, branch, state, executive, auditor, scope, briefauditor, checkboxlist, auditstatus, status, risk, start_date, end_date
        }
        const newAudit = new Audit(audit)
        await newAudit.save()
        response.status(201).json(newAudit)
    } catch (error) {
        next(error)
    }
}

// const dateObject = new Date(dateFilter);
//             const nextDay = new Date(dateObject);
//             nextDay.setDate(dateObject.getDate() + 1);
//             matchStage['createdAt'] = {
//                 $gte: dateObject,
//                 $lt: nextDay
//             };

// export const auditGetting = async (request, response, next) => {
//     try {
//         const auditData = await Audit.aggregate([
//             {
//                 $match: {}
//             },

//             {
//                 $lookup: {
//                     from: "companies",
//                     localField: "company",
//                     foreignField: "_id",
//                     as: "companyData"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "states",
//                     localField: "state",
//                     foreignField: "_id",
//                     as: "stateData"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "branches",
//                     localField: "branch",
//                     foreignField: "_id",
//                     as: "branchData"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "executive",
//                     foreignField: "_id",
//                     as: "executiveData"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "auditor",
//                     foreignField: "_id",
//                     as: "auditorData"
//                 }
//             },
//             {
//                 $project: {
//                     title: 1,
//                     start_date: 1,
//                     end_date: 1,
//                     overdue: 1,
//                     auditstatus: 1,
//                     risk: 1,
//                     score: 1,
//                     executive: {
//                         $concat: [
//                             { $arrayElemAt: ["$executiveData.firstName", 0] },
//                             " ",
//                             { $arrayElemAt: ["$executiveData.lastName", 0] }
//                         ]
//                     },
//                     auditor: {
//                         $concat: [
//                             { $arrayElemAt: ["$auditorData.firstName", 0] },
//                             " ",
//                             { $arrayElemAt: ["$auditorData.lastName", 0] }
//                         ]
//                     },
//                     state: { $arrayElemAt: ["$stateData.name", 0] },
//                     company: { $arrayElemAt: ["$companyData.companyname", 0] },
//                     branch: { $arrayElemAt: ["$branchData.name", 0] },
//                     overdue : overDue()
//                 }
//             }
//         ])

//         const overDue = function() {

//             let result
//             let yy, mm, dd

//             auditData.forEach(data => {
//                 let currentDate = new Date()
//                 let endDate = data.end_date
//                 let ed = endDate.getDate()
//                 let em = endDate.getMonth() + 1
//                 let ey = endDate.getFullYear()

//                 let cd = currentDate.getDate()
//                 let cm = currentDate.getMonth() + 1
//                 let cy = currentDate.getFullYear()

//                 yy = cy - ey

//                 if (cm >= em) {
//                     mm = cm - em
//                 }
//                 else {
//                     yy--
//                     mm = 12 + cm - em
//                 }
//                 if (cd >= ed) {
//                     dd = cd - ed
//                 }
//                 else {
//                     mm--
//                     dd = getMonthDays(ey, em) + cd - ed
//                 }
//                 if (mm < 0) {
//                     mm = 11
//                     yy--
//                 }
//                 function getMonthDays(year, month) {
//                     return new Date(year, month, 0).getDate()
//                 }
//                 // const dayOfYear = date =>
//                 // Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86_400_000);
//                 // console.log(dayOfYear("2024-02-24"));
//                 result = dd + mm * getMonthDays(ey, em) + yy
//                 console.log(dd + mm * getMonthDays(ey, em) + yy);
//                 return result
//             })
//         }

//         response.status(200).json(auditData)
//     } catch (error) {
//         next(error)
//     }
// }




// export const auditGetting = async (request, response, next) => {
//     try {
//         const auditData = await Audit.aggregate([
//             {
//                 $match: {}
//             },
//             {
//                 $lookup: {
//                     from: "companies",
//                     localField: "company",
//                     foreignField: "_id",
//                     as: "companyData"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "states",
//                     localField: "state",
//                     foreignField: "_id",
//                     as: "stateData"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "branches",
//                     localField: "branch",
//                     foreignField: "_id",
//                     as: "branchData"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "executive",
//                     foreignField: "_id",
//                     as: "executiveData"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "auditor",
//                     foreignField: "_id",
//                     as: "auditorData"
//                 }
//             },
//             {
//                 $project: {
//                     title: 1,
//                     start_date: 1,
//                     end_date: 1,
//                     overdue: {
//                         $let: {
//                             vars: {
//                                 currentDate: new Date(),
//                                 endDate: "$end_date"
//                             },
//                             in: {
//                                 $let: {
//                                     vars: {
//                                         ed: { $dayOfMonth: "$$endDate" },
//                                         em: { $month: "$$endDate" },
//                                         ey: { $year: "$$endDate" },
//                                         cd: { $dayOfMonth: "$$currentDate" },
//                                         cm: { $month: "$$currentDate" },
//                                         cy: { $year: "$$currentDate" }
//                                     },
//                                     in: {
//                                         $let: {
//                                             vars: {
//                                                 yy: { $subtract: ["$$cy", "$$ey"] },
//                                                 mm: {
//                                                     $cond: {
//                                                         if: { $gte: ["$$cm", "$$em"] },
//                                                         then: { $subtract: ["$$cm", "$$em"] },
//                                                         else: { $subtract: [{ $add: ["$$cm", 12] }, "$$em"] }
//                                                     }
//                                                 },
//                                                 dd: {
//                                                     $cond: {
//                                                         if: { $gte: ["$$cd", "$$ed"] },
//                                                         then: { $subtract: ["$$cd", "$$ed"] },
//                                                         else: {
//                                                             $subtract: [
//                                                                 { $add: ["$$cd", { $dayOfMonth: { $dateFromParts: { year: "$$ey", month: "$$em", day: 0 } } }] },
//                                                                 "$$ed"
//                                                             ]
//                                                         }
//                                                     }
//                                                 }
//                                             },
//                                             in: { $add: ["$$dd", { $multiply: ["$$mm", { $dayOfMonth: { $dateFromParts: { year: "$$ey", month: "$$em", day: 0 } } }] }, { $multiply: ["$$yy", { $dayOfMonth: { $dateFromParts: { year: "$$ey", month: "$$em", day: 0 } } }] }] }
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     },
//                     auditstatus: 1,
//                     risk: 1,
//                     score: 1,
//                     executive: {
//                         $concat: [
//                             { $arrayElemAt: ["$executiveData.firstName", 0] },
//                             " ",
//                             { $arrayElemAt: ["$executiveData.lastName", 0] }
//                         ]
//                     },
//                     auditor: {
//                         $concat: [
//                             { $arrayElemAt: ["$auditorData.firstName", 0] },
//                             " ",
//                             { $arrayElemAt: ["$auditorData.lastName", 0] }
//                         ]
//                     },
//                     state: { $arrayElemAt: ["$stateData.name", 0] },
//                     company: { $arrayElemAt: ["$companyData.companyname", 0] },
//                     branch: { $arrayElemAt: ["$branchData.name", 0] }
//                 }
//             }
//         ]);

//         response.status(200).json(auditData);
//     } catch (error) {
//         next(error);
//     }
// };


// export const auditGetting = async (request, response, next) => {
//     try {
//         const auditData = await Audit.aggregate([
//             {
//                 $match: {}
//             },
//             {
//                 $lookup: {
//                     from: "companies",
//                     localField: "company",
//                     foreignField: "_id",
//                     as: "companyData"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "states",
//                     localField: "state",
//                     foreignField: "_id",
//                     as: "stateData"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "branches",
//                     localField: "branch",
//                     foreignField: "_id",
//                     as: "branchData"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "executive",
//                     foreignField: "_id",
//                     as: "executiveData"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "auditor",
//                     foreignField: "_id",
//                     as: "auditorData"
//                 }
//             },
//             {
//                 $project: {
//                     title: 1,
//                     start_date: 1,
//                     end_date: 1,
//                     overdue: {
//                         $cond: {
//                             if: { $lt: ["$end_date", new Date()] },
//                             then: {
//                                 $ceil: {
//                                     $divide: [
//                                         {
//                                             $subtract: [new Date(), "$end_date"]
//                                         },
//                                         1000 * 60 * 60 * 24 // Convert milliseconds to days
//                                     ]
//                                 }
//                             },
//                             else: 0 // Project is not overdue
//                         }
//                     },
//                     auditstatus: 1,
//                     risk: 1,
//                     score: 1,
//                     executive: {
//                         $concat: [
//                             { $arrayElemAt: ["$executiveData.firstName", 0] },
//                             " ",
//                             { $arrayElemAt: ["$executiveData.lastName", 0] }
//                         ]
//                     },
//                     auditor: {
//                         $concat: [
//                             { $arrayElemAt: ["$auditorData.firstName", 0] },
//                             " ",
//                             { $arrayElemAt: ["$auditorData.lastName", 0] }
//                         ]
//                     },
//                     state: { $arrayElemAt: ["$stateData.name", 0] },
//                     company: { $arrayElemAt: ["$companyData.companyname", 0] },
//                     branch: { $arrayElemAt: ["$branchData.name", 0] }
//                 }
//             }
//         ]);

//         response.status(200).json(auditData);
//     } catch (error) {
//         next(error);
//     }
// }


export const auditGetting = async (request, response, next) => {
    try {
        let auditData = await Audit.aggregate([
            {
                $match: {}
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "companyData"
                }
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData"
                }
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branch",
                    foreignField: "_id",
                    as: "branchData"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "executive",
                    foreignField: "_id",
                    as: "executiveData"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "auditor",
                    foreignField: "_id",
                    as: "auditorData"
                }
            },
            {
                $project: {
                    title: 1,
                    start_date: 1,
                    end_date: 1,
                    overdue: {
                        $cond: {
                            if: { $lt: ["$end_date", new Date()] },
                            then: {
                                $subtract: [
                                    {
                                        $ceil: {
                                            $divide: [
                                                {
                                                    $subtract: [new Date(), "$end_date"]
                                                },
                                                1000 * 60 * 60 * 24 // Convert milliseconds to days
                                            ]
                                        }
                                    },
                                    1 // Subtract 1 day from the calculated overdue days
                                ]
                            },
                            else: 0 // Project is not overdue
                        }
                    },
                    auditstatus: 1,
                    risk: 1,
                    score: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    auditor: {
                        $concat: [
                            { $arrayElemAt: ["$auditorData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$auditorData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.companyname", 0] },
                    branch: { $arrayElemAt: ["$branchData.name", 0] }
                }
            }
        ]);
        let users = await User.find({})
        let auditorData = users.filter(user => {
            return user.role === "Auditor"
        })
        let count = 0
        auditData.filter(doc => {
            const result = auditorData.map(data => data.firstName + " " + data.lastName).includes(doc.auditor)
            if (result && doc.overdue > 0) {
                return count++
            }
        })
        response.status(200).json(({ total: count, data: auditData }));
    } catch (error) {
        next(error);
    }
}


export const updateAudit = async (request, response, next) => {
    try {
        const auditId = request.params.id
        const data = request.body
        const checkAuditIdExists = await Audit.findById({ _id: auditId })
        if (!checkAuditIdExists) {
            response.status(400).json("Audit id doesn't exists")
        }
        const auditData = await Audit.findByIdAndUpdate({ _id: auditId }, data, { new: true })
        response.status(201).json(auditData)
    } catch (error) {
        next(error)
    }
}

// ---------------------- Audit Checklist Filter ----------------------

export const auditChecklistFilter = async (request, response, next) => {
    try {
        const stateFilter = request.body.state;
        const branchFilter = request.body.branchname;
        const categoryFilter = request.body.company;
        const complianceFilter = request.body.compliance;

        const matchStage = {};
        matchStage['status'] = { $eq: 0 }

        if (stateFilter !== undefined && complianceFilter !== undefined && categoryFilter !== undefined && branchFilter !== undefined && stateFilter !== "" && complianceFilter !== "" && categoryFilter !== "" && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(categoryFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
            matchStage['compliance'] = new mongoose.Types.ObjectId(complianceFilter.toString())
        }

        // ------------ 3 Filter --------------
        else if (stateFilter !== undefined && stateFilter !== "" && categoryFilter !== undefined && categoryFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
            matchStage['category'] = new mongoose.Types.ObjectId(categoryFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && complianceFilter !== undefined && complianceFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['compliance'] = new mongoose.Types.ObjectId(complianceFilter.toString());
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && categoryFilter !== undefined && categoryFilter !== "" && complianceFilter !== undefined && complianceFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['category'] = new mongoose.Types.ObjectId(categoryFilter.toString());
            matchStage['compliance'] = new mongoose.Types.ObjectId(complianceFilter.toString());

        }
        else if (categoryFilter !== undefined && categoryFilter !== "" && complianceFilter !== undefined && complianceFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
            matchStage['compliance'] = new mongoose.Types.ObjectId(complianceFilter.toString())
            matchStage['category'] = new mongoose.Types.ObjectId(categoryFilter.toString())

        }

        // ------------------ 2 Filter ----------------

        else if (stateFilter !== undefined && stateFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
        }
        else if (stateFilter !== undefined && stateFilter !== "" && complianceFilter !== undefined && complianceFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['compliance'] = new mongoose.Types.ObjectId(complianceFilter.toString())
        }
        else if (stateFilter !== undefined && stateFilter !== "" && categoryFilter !== undefined && categoryFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['category'] = new mongoose.Types.ObjectId(categoryFilter.toString())
        }
        else if (branchFilter !== undefined && branchFilter !== "" && categoryFilter !== undefined && categoryFilter !== "") {
            matchStage['category'] = new mongoose.Types.ObjectId(categoryFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
        }
        else if (branchFilter !== undefined && branchFilter !== "" && complianceFilter !== undefined && complianceFilter !== "") {
            matchStage['compliance'] = new mongoose.Types.ObjectId(complianceFilter.toString());
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
        }
        else if (categoryFilter !== undefined && categoryFilter !== "" && complianceFilter !== undefined && complianceFilter !== "") {
            matchStage['compliance'] = new mongoose.Types.ObjectId(complianceFilter.toString());
            matchStage['category'] = new mongoose.Types.ObjectId(categoryFilter.toString())
        }

        // ------------------ 1 Filter ----------------------
        else if (stateFilter !== undefined && stateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (complianceFilter !== undefined && complianceFilter !== "") {
            matchStage['compliance'] = new mongoose.Types.ObjectId(complianceFilter.toString());
        }
        else if (categoryFilter !== undefined && categoryFilter !== "") {
            matchStage['category'] = new mongoose.Types.ObjectId(categoryFilter.toString())
        }
        else if (branchFilter !== undefined && branchFilter !== "") {
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
        }

        // console.log(matchStage);
        const filter = await CheckList.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $lookup: {
                    from: "compliances",
                    localField: "compliance",
                    foreignField: "_id",
                    as: "complianceData",
                },
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branchname",
                    foreignField: "_id",
                    as: "branchData",
                },
            },
            {
                $project: {
                    _id: 1,
                    state: 1,
                    act: 1,
                    rule: 1,
                    category: 1,
                    form: 1,
                    document: 1,
                    question: 1,
                    description: 1,
                    compliance: 1,
                    risk: 1,
                    consequences: 1,
                    frequency: 1,
                    duedate: 1,
                    remark: 1,
                    compliance: { $arrayElemAt: ["$complianceData.act", 0] },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.name", 0] },
                    branch: { $arrayElemAt: ["$branchData.name", 0] },
                }
            }
        ]);

        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
};


// export const auditFilter = async (request, response, next) => {
//     try {
//         const data = request.body
//         const matchStage = {}
//         const { company, state, branch, executive, auditor, start_date, end_date, overdue, auditstatus, risk } = data
//         let overDueData = await Audit.find({})
//         let result, cd, cm, cy, dd, md, yd, ed, em, ey
//         overDueData.forEach(data => {
//             let currentDate = new Date()
//             let endDate = data.end_date
//             ed = endDate.getDate()
//             em = endDate.getMonth() + 1
//             ey = endDate.getFullYear()

//             cd = currentDate.getDate()
//             cm = currentDate.getMonth() + 1
//             cy = currentDate.getFullYear()

//             dd = cd - ed
//             md = cm - em
//             yd = cy - ey
//             result = Math.abs(dd + md * getMonthDays(ey, em))
//             // console.log(result);

//             return result


//             function getMonthDays(year, month) {
//                 return new Date(year, month, 0).getDate()
//             }
//         })
//         overDueData.forEach(item=>{
//             console.log(item.overdue = result);
//         })

//         const filters = { company, state, branch, executive, auditor, start_date, end_date, overdue: result, auditstatus, risk }
//         console.log(filters);

//         const filterKeys = Object.keys(filters).filter(key => filters[key] !== undefined && filters[key] !== "")

//         if (filterKeys.length > 0) {
//             for (const key of filterKeys) {
//                 if (key === "company" || key === "state" || key === "branch" || key === "executive" || key === "auditor") {
//                     matchStage[key] = new mongoose.Types.ObjectId(filters[key])
//                 }
//                 else if (key === "auditstatus" || key === "risk" || key === 'overdue') {
//                     matchStage[key] = filters[key]
//                 }
//                 // else if (key === 'overdue'){
//                 //     matchStage['overdue'] = filters[key]
//                 // }
//                 else if (key === "start_date" || key === "end_date") {
//                     const dateObject = new Date(filters[key]);
//                     const nextDay = new Date(dateObject);
//                     nextDay.setDate(dateObject.getDate() + 1);
//                     matchStage[key] = {
//                         $gte: dateObject,
//                         $lt: nextDay
//                     };
//                 }
//             }
//         }
//         const filter = await Audit.aggregate([
//             {
//                 $match: matchStage
//             },
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "auditor",
//                     foreignField: "_id",
//                     as: "executiveData"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "states",
//                     localField: "state",
//                     foreignField: "_id",
//                     as: "stateData",
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "categories",
//                     localField: "category",
//                     foreignField: "_id",
//                     as: "categoryData",
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "companies",
//                     localField: "company",
//                     foreignField: "_id",
//                     as: "companyData",
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "branches",
//                     localField: "branchname",
//                     foreignField: "_id",
//                     as: "branchData",
//                 },
//             },

//             {
//                 $project: {
//                     title: 1,
//                     start_date: 1,
//                     end_date: 1,
//                     overdue: 1,
//                     status: 1,
//                     overdue: {
//                         $cond: {
//                             if: { $lt: ["$end_date", new Date()] },
//                             then: {
//                                 $subtract: [
//                                     {
//                                         $ceil: {
//                                             $divide: [
//                                                 {
//                                                     $subtract: [new Date(), "$end_date"]
//                                                 },
//                                                 1000 * 60 * 60 * 24 // Convert milliseconds to days
//                                             ]
//                                         }
//                                     },
//                                     1 // Subtract 1 day from the calculated overdue days
//                                 ]
//                             },
//                             else: 0 // Project is not overdue
//                         }
//                     },
//             risk: 1,
//             executive: {
//                 $concat: [
//                     { $arrayElemAt: ["$executiveData.firstName", 0] },
//                     " ",
//                     { $arrayElemAt: ["$executiveData.lastName", 0] }
//                 ]
//             },
//             state: { $arrayElemAt: ["$stateData.name", 0] },
//             category: { $arrayElemAt: ["$categoryData.name", 0] },
//             company: { $arrayElemAt: ["$companyData.name", 0] },
//             branch: { $arrayElemAt: ["$branchData.name", 0] }
//                 }
//             }

//         ])
// // filter.forEach(data => {
// //     console.log(data.overdue);
// // })
// response.status(200).json(filter)

//     } catch (error) {
//     next(error)
// }
// }


export const auditFilter = async (request, response, next) => {
    try {
        const data = request.body;
        const matchStage = {};
        const { company, state, branch, executive, auditor, start_date, end_date, overdue, auditstatus, risk } = data;
        let auditDataFilter

        // Define filters
        const filters = { company, state, branch, executive, auditor, start_date, end_date, auditstatus, risk };
        const filterKeys = Object.keys(filters).filter(key => filters[key] !== undefined && filters[key] !== "");

        // Build match stage based on filters
        if (filterKeys.length > 0) {
            for (const key of filterKeys) {
                if (key === "company" || key === "state" || key === "branch" || key === "executive" || key === "auditor") {
                    matchStage[key] = new mongoose.Types.ObjectId(filters[key]);
                } else if (key === "auditstatus" || key === "risk") {
                    matchStage[key] = filters[key];
                }
                // else if(key === "overdue"){

                // }
                else if (key === "start_date" || key === "end_date") {
                    const dateObject = new Date(filters[key]);
                    const nextDay = new Date(dateObject);
                    nextDay.setDate(dateObject.getDate() + 1);
                    matchStage[key] = {
                        $gte: dateObject,
                        $lt: nextDay
                    };
                }
            }
        }

        // Perform aggregation
        auditDataFilter = await Audit.aggregate([
            { $match: matchStage },
            // Add your lookup and project stages here
            {
                $lookup: {
                    from: "users",
                    localField: "auditor",
                    foreignField: "_id",
                    as: "executiveData"
                }
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "companyData",
                },
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branchname",
                    foreignField: "_id",
                    as: "branchData",
                },
            },

            {
                $project: {
                    title: 1,
                    start_date: 1,
                    end_date: 1,
                    overdue: 1,
                    status: 1,
                    overdue: {
                        $cond: {
                            if: { $lt: ["$end_date", new Date()] },
                            then: {
                                $subtract: [
                                    {
                                        $ceil: {
                                            $divide: [
                                                {
                                                    $subtract: [new Date(), "$end_date"]
                                                },
                                                1000 * 60 * 60 * 24 // Convert milliseconds to days
                                            ]
                                        }
                                    },
                                    1 // Subtract 1 day from the calculated overdue days
                                ]
                            },
                            else: 0 // Project is not overdue
                        }
                    },
                    risk: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.companyname", 0] },
                    branch: { $arrayElemAt: ["$branchData.name", 0] }
                }
            }

        ]);
        // console.log(auditDataFilter);
        if (overdue !== undefined & overdue !== "") {
            const currentDate = new Date();
            auditDataFilter = auditDataFilter.filter(doc => {
                return doc.overdue == overdue
            });
        }
        // console.log(auditDataFilter);

        response.status(200).json({ Total: auditDataFilter.length, data: auditDataFilter });
    } catch (error) {
        next(error);
    }
};

// export const auditFilter = async (request, response, next) => {
//     try {
//         const data = request.body;
//         const matchStage = {};
//         const { company, state, branch, executive, auditor, start_date, end_date, overdue, auditstatus, risk } = data;

//         // Define filters
//         const filters = { company, state, branch, executive, auditor, start_date, end_date, auditstatus, risk };
//         const filterKeys = Object.keys(filters).filter(key => filters[key] !== undefined && filters[key] !== "");

//         // Build match stage based on filters
//         if (filterKeys.length > 0) {
//             for (const key of filterKeys) {
//                 if (key === "company" || key === "state" || key === "branch" || key === "executive" || key === "auditor") {
//                     matchStage[key] = new mongoose.Types.ObjectId(filters[key]);
//                 } else if (key === "auditstatus" || key === "risk" || key === 'overdue') {
//                     matchStage[key] = filters[key];
//                 } else if (key === "start_date" || key === "end_date") {
//                     const dateObject = new Date(filters[key]);
//                     const nextDay = new Date(dateObject);
//                     nextDay.setDate(dateObject.getDate() + 1);
//                     matchStage[key] = {
//                         $gte: dateObject,
//                         $lt: nextDay
//                     };
//                 }
//             }
//         }

//         // Fetch documents from the database based on the match stage
//         let documents = await Audit.find(matchStage);

//         // Filter documents based on dynamic overdue calculation
//         documents = documents.filter(doc => {
//             // Calculate overdue dynamically for each document
//             const currentDate = new Date();
//             const endDate = doc.end_date;
//             const diffInDays = Math.ceil((currentDate - endDate) / (1000 * 60 * 60 * 24));
//             return diffInDays === overdue;
//         });

//         response.status(200).json(documents);
//     } catch (error) {
//         next(error);
//     }
// };

// export const auditFilter = async (request, response, next) => {
//     try {
//         const data = request.body;
//         const { company, state, branch, executive, auditor, start_date, end_date, overdue, auditstatus, risk } = data;

//         // Define filters
//         const filters = { company, state, branch, executive, auditor, start_date, end_date, auditstatus, risk };
//         const filterKeys = Object.keys(filters).filter(key => filters[key] !== undefined && filters[key] !== "");

//         // Build match stage based on filters
//         const matchStage = {};
//         if (filterKeys.length > 0) {
//             for (const key of filterKeys) {
//                 if (key === "company" || key === "state" || key === "branch" || key === "executive" || key === "auditor") {
//                     matchStage[key] = new mongoose.Types.ObjectId(filters[key]);
//                 } else if (key === "auditstatus" || key === "risk" || key === 'overdue') {
//                     matchStage[key] = filters[key];
//                 } else if (key === "start_date" || key === "end_date") {
//                     const dateObject = new Date(filters[key]);
//                     const nextDay = new Date(dateObject);
//                     nextDay.setDate(dateObject.getDate() + 1);
//                     matchStage[key] = {
//                         $gte: dateObject,
//                         $lt: nextDay
//                     };
//                 }
//             }
//         }

//         // Fetch documents from the database based on the match stage
//         let documents = await Audit.find(matchStage);
//         console.log(documents);

//         // Filter documents based on the calculated overdue
//         if (overdue !== undefined) {
//             const currentDate = new Date();
//             documents = documents.filter(doc => {
//                 const endDate = new Date(doc.end_date);
//                 const diffInDays = Math.ceil((currentDate - endDate) / (1000 * 60 * 60 * 24));
//                 return diffInDays === overdue;
//             });
//         }

//         response.status(200).json(documents);
//     } catch (error) {
//         next(error);
//     }
// };



// --------------------- Lise & Reg Functions ------------------------



// export const createLiseReg = async (request, response, next) => {
//     try {
//         const data = request.body
//         const { regNo, rate, docReqDate, docReqFollow, docReviewDate, docRemark, status, appliedDate, applicationStatus, remark, challlanFees, challanNumber, challanDate, directExpenses, inDirectExpenses, totalExpenses, licenseNumber, dateOfIssue, expireDate, renewalDate, invoiceType, invoiceDate, invoiceNumber, submissionDate, branchName, company, executive, state, branch
//         } = data

//         for (const key in data) {
//             // if (data.hasOwnProperty(key)) {
//             const value = data[key];
//             if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
//                 response.status(400).json("Data is missing, Either empty, undefined or null") // Input data is empty, null, or undefined
//             }
//             // }
//         }
//         const documents = request.files.documents ? request.files.documents[0] : null;
//         const acknowledge = request.files.acknowledge ? request.files.acknowledge[0] : null;
//         const licenseUpload = request.files.licenseUpload ? request.files.licenseUpload[0] : null;
//         const challanUpload = request.files.challanUpload ? request.files.challanUpload[0] : null;


//         let docImageUrl, ackImageUrl, challanImageUrl, licImageUrl, formattedDocName, formattedAckName, formattedChallanName, formattedLicName

//         const uploadsDirectory = './data/uploads/';
//         const imageDirectory = 'images/';

//         fs.access(uploadsDirectory, (err) => {
//             if (err) {
//                 fs.mkdirSync(uploadsDirectory, { recursive: true });
//             }
//         });

//         // Ensure that the images directory exists
//         fs.access(uploadsDirectory + imageDirectory, (err) => {
//             if (err) {
//                 fs.mkdirSync(uploadsDirectory + imageDirectory, { recursive: true });
//             }
//         });

//         const url = request.protocol + '://' + request.get('host');

//         if (documents) {
//             formattedDocName = Date.now() + documents.originalname.split(' ').join('-');
//             await sharp(documents.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedDocName);
//             docImageUrl = url + '/' + imageDirectory + formattedDocName;
//         }
//         if (acknowledge) {
//             formattedAckName = Date.now() + acknowledge.originalname.split(' ').join('-');
//             await sharp(acknowledge.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedAckName);
//             ackImageUrl = url + '/' + imageDirectory + formattedAckName;
//         }
//         if (licenseUpload) {
//             formattedLicName = Date.now() + licenseUpload.originalname.split(' ').join('-');
//             await sharp(licenseUpload.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedLicName);
//             licImageUrl = url + '/' + imageDirectory + formattedLicName;
//         }
//         if (challanUpload) {
//             formattedChallanName = Date.now() + challanUpload.originalname.split(' ').join('-');
//             await sharp(challanUpload.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedChallanName);
//             challanImageUrl = url + '/' + imageDirectory + formattedChallanName;
//         }

//         if (regNo && rate) {
//             const liseReg = {
//                 regNo, rate
//             }
//             new Lisereg(liseReg)
//         }
//         if (regNo && rate && documents && docReqDate && docReqFollow && docReviewDate && status && docRemark) {
//             const liseReg = {
//                 regNo, rate, documents: docImageUrl, docReqDate, docReqFollow, docReviewDate, status, docRemark
//             }
//             new Lisereg(liseReg)

//         }
//         if (regNo && rate && documents && docReqDate && docReqFollow && docReviewDate && docRemark && status && docRemark && appliedDate && applicationStatus && remark && acknowledge) {

//             const liseReg = {
//                 regNo, rate, documents: docImageUrl, docReqDate, docReqFollow, docReviewDate, status, docRemark, appliedDate, applicationStatus, remark, acknowledge: ackImageUrl
//             }
//             new Lisereg(liseReg)
//         }
//         if (regNo && rate && documents && docReqDate && docReqFollow && docReviewDate && docRemark && status && docRemark && appliedDate && applicationStatus && remark && acknowledge && challlanFees && challanNumber && challanDate && challanUpload && directExpenses && inDirectExpenses && totalExpenses) {

//             const liseReg = {
//                 regNo, rate, documents: docImageUrl, docReqDate, docReqFollow, docReviewDate, status, docRemark, appliedDate, applicationStatus, remark, acknowledge: ackImageUrl, challlanFees, challanNumber, challanDate, challanUpload: challanImageUrl, directExpenses, inDirectExpenses, totalExpenses
//             }
//             new Lisereg(liseReg)

//         }
//         if (regNo && rate && documents && docReqDate && docReqFollow && docReviewDate && docRemark && status && docRemark && appliedDate && applicationStatus && remark && acknowledge && challlanFees && challanNumber && challanDate && challanUpload && directExpenses && inDirectExpenses && totalExpenses && licenseNumber && dateOfIssue && expireDate && renewalDate && licenseUpload) {

//             const liseReg = {
//                 regNo, rate, documents: docImageUrl, docReqDate, docReqFollow, docReviewDate, status, docRemark, appliedDate, applicationStatus, remark, acknowledge: ackImageUrl, challlanFees, challanNumber, challanDate, challanUpload: challanImageUrl, directExpenses, inDirectExpenses, totalExpenses, licenseNumber, dateOfIssue, expireDate, renewalDate, licenseUpload: licImageUrl
//             }
//             new Lisereg(liseReg)

//         }
//         if (regNo && rate && documents && docReqDate && docReqFollow && docReviewDate && docRemark && status && docRemark && appliedDate && applicationStatus && remark && acknowledge && challlanFees && challanNumber && challanDate && challanUpload && directExpenses && inDirectExpenses && totalExpenses && licenseNumber && dateOfIssue && expireDate && renewalDate && licenseUpload && invoiceType && invoiceDate && invoiceNumber && submissionDate) {

//             const liseReg = {
//                 regNo, rate, documents: docImageUrl, docReqDate, docReqFollow, docReviewDate, status, docRemark, appliedDate, applicationStatus, remark, acknowledge: ackImageUrl, challlanFees, challanNumber, challanDate, challanUpload: challanImageUrl, directExpenses, inDirectExpenses, totalExpenses, licenseNumber, dateOfIssue, expireDate, renewalDate, licenseUpload: licImageUrl, invoiceType, invoiceDate, invoiceNumber, submissionDate
//             }
//             new Lisereg(liseReg)

//         }
//         if (regNo && rate && documents && docReqDate && docReqFollow && docReviewDate && docRemark && status && docRemark && appliedDate && applicationStatus && remark && acknowledge && challlanFees && challanNumber && challanDate && challanUpload && directExpenses && inDirectExpenses && totalExpenses && licenseNumber && dateOfIssue && expireDate && renewalDate && licenseUpload && invoiceType && invoiceDate && invoiceNumber && submissionDate && branchName && company && executive && state && branch) {

//             const liseReg = {
//                 regNo, rate, documents: docImageUrl, docReqDate, docReqFollow, docReviewDate, status, docRemark, appliedDate, applicationStatus, remark, acknowledge: ackImageUrl, challlanFees, challanNumber, challanDate, challanUpload: challanImageUrl, directExpenses, inDirectExpenses, totalExpenses, licenseNumber, dateOfIssue, expireDate, renewalDate, licenseUpload: licImageUrl, invoiceType, invoiceDate, invoiceNumber, submissionDate, branchName, company, executive, state, branch
//             }

//             const newLiseReg = new Lisereg(liseReg)
//             await newLiseReg.save()
//             response.status(201).json(newLiseReg)
//         }
//     } catch (error) {
//         next(error)
//     }
// }




// ---------------------------------- Elibrary -------------------------------------------

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


export const elibraryGetting = async (request, response, next) => {
    try {
        const elibraryData = await Elibrary.aggregate([
            {
                $match: {}
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "executive",
                    foreignField: "_id",
                    as: "executiveData"
                }
            },
            {
                $project: {
                    placeholder: 1,
                    image: 1,
                    approveStatus: 1,
                    createdAt: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },

                    category: { $arrayElemAt: ["$categoryData.name", 0] }
                }
            }
        ])
        response.status(200).json(elibraryData)
    } catch (error) {
        next(error)
    }
}
export const elibraryGettingById = async (request, response, next) => {
    try {
        const { id: elibraryId } = request.params
        const checkElibraryId = await Elibrary.findById({ _id: elibraryId })
        if (!checkElibraryId) {
            response.status(404).json("This elibrary doesn't exists")
        }
        response.status(200).json(checkElibraryId)
        // const filter = await Elibrary.aggregate([
        //     {
        //         $match : {
        //             _id : new mongoose.Types.ObjectId(elibraryId.toString())
        //         }
        //     }
        // ])
        // response.status(200).json(filter)
    } catch (error) {
        next(error)
    }
}

export const elibraryApproved = async (request, response, next) => {
    try {
        const elibraryData = await Elibrary.aggregate([
            {
                $match: {
                    status: { $eq: 1 }
                }
            }
        ])
        response.status(200).json(elibraryData)
    } catch (error) {

    }
}
export const elibraryRejected = async (request, response, next) => {
    try {
        const elibraryData = await Elibrary.aggregate([
            {
                $match: {
                    status: { $eq: 2 }
                }
            }
        ])
        response.status(200).json(elibraryData)
    } catch (error) {

    }
}


// ---------------------------using then catch --------------------------
// export const elibraryGetting = (request, res, next) => {
//     try {
//         Elibrary.find({}).then(response => {
//             response.map(data => {
//                 console.log(data.label);
//             })
//         })
//     } catch (error) {
//         next(error)
//     }
// }



export const createLiseReg = async (request, response, next) => {
    try {
        const data = request.body
        let { regNo, rate, docReqDate, docReqFollow, docReviewDate, docRemark, docStatus, imagetypedoc, appliedDate, applicationStatus, applicationRemark, acknowledgeType, challlanFees, challanNumber, challanDate, directExpenses, challanUploadType, inDirectExpenses, totalExpenses, licenseNumber, dateOfIssue, expireDate, renewalDate, licenseUploadType, invoiceType, invoiceDate, invoiceNumber, submissionDate, status, company, executive, state, branch, created_at
        } = data

        let docImageUrl, ackImageUrl, challanImageUrl, licImageUrl, formattedDocName, formattedAckName, formattedChallanName, formattedLicName, documents, acknowledge, licenseUpload, challanUpload, newLiseReg, liseReg, findRegNo;

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

        const url = request.protocol + '://' + request.get('host');
        // console.log(request.files);return;
        if (request.files?.documents !== undefined && request.files?.documents[0] !== undefined) {
            documents = request.files.documents[0];
            // console.log(documents);return;
            if (documents) {
                formattedDocName = Date.now() + documents.originalname.split(' ').join('-');
                await sharp(documents.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedDocName);
                docImageUrl = url + '/' + imageDirectory + formattedDocName;
            }
        }
        if (request.files?.acknowledge !== undefined && request.files.acknowledge[0] !== undefined) {
            acknowledge = request.files.acknowledge[0];
            if (acknowledge) {
                formattedAckName = Date.now() + acknowledge.originalname.split(' ').join('-');
                await sharp(acknowledge.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedAckName);
                ackImageUrl = url + '/' + imageDirectory + formattedAckName;
            }
        }
        if (request.files?.licenseUpload !== undefined && request.files.licenseUpload[0] !== undefined) {
            licenseUpload = request.files.licenseUpload[0];
            if (licenseUpload) {
                formattedLicName = Date.now() + licenseUpload.originalname.split(' ').join('-');
                await sharp(licenseUpload.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedLicName);
                licImageUrl = url + '/' + imageDirectory + formattedLicName;
            }
        }
        if (request.files?.challanUpload !== undefined && request.files.challanUpload[0] !== undefined) {
            challanUpload = request.files.challanUpload[0];
            if (challanUpload) {
                formattedChallanName = Date.now() + challanUpload.originalname.split(' ').join('-');
                await sharp(challanUpload.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedChallanName);
                challanImageUrl = url + '/' + imageDirectory + formattedChallanName;
            }
        }



        const regNos = await Lisereg.findOne({ regNo: request.body.regNo });

        if (regNos) {
            return response.send({ message: "409, Registration/License Number already exists" });
        }


        if (regNo && rate) {
            console.log('you are here');
            const liseReg = {
                regNo, rate
            }
            newLiseReg = new Lisereg(liseReg)
            await newLiseReg.save()

            // response.status(201).json(newLiseReg)
        }
        const lastInsertedId = await Lisereg.find({}).sort({ '_id': -1 }).limit(1)
        console.log(lastInsertedId[0].regNo);

        // const  getregNoandrate = getregNoandrates();


        if (documents && docReqDate && docReqFollow && docReviewDate && docStatus && docRemark) {
            console.log('you are in docremark');
            liseReg = {
                documents: docImageUrl, docReqDate, docReqFollow, docReviewDate, docStatus, docRemark, imagetypedoc
            }
            // const newLiseReg = await Lisereg.findOneAndUpdate({ regNo }, liseReg, { new: true })
            // response.status(201).json(newLiseReg)
        }
        if (applicationRemark && appliedDate && applicationStatus && acknowledge) {
            console.log('you are in ack');

            liseReg = {
                appliedDate, applicationStatus, applicationRemark, acknowledge: ackImageUrl, acknowledgeType
            }
            // const newLiseReg = await Lisereg.findOneAndUpdate({ regNo }, liseReg, { new: true })
            // response.status(201).json(newLiseReg)
        }
        if (challlanFees && challanNumber && challanDate && challanUpload && directExpenses && inDirectExpenses && totalExpenses) {
            console.log('you are in totalexpenses');
            const checkChallanNumber = await Lisereg.findOne({ challanNumber })
            if (checkChallanNumber) {
                return response.send({ message: "409, Challan Number already exists" })
            }
            liseReg = {
                challlanFees, challanNumber, challanDate, challanUpload: challanImageUrl, directExpenses, inDirectExpenses, totalExpenses, challanUploadType
            }
            // const newLiseReg = await Lisereg.findOneAndUpdate({ regNo }, liseReg, { new: true })
            // response.status(201).json(newLiseReg)
        }


        if (dateOfIssue && expireDate && renewalDate && licenseUpload) {
            console.log('you are in licenseupload');
            liseReg = {
                licenseNumber, dateOfIssue, expireDate, renewalDate, licenseUpload: licImageUrl, licenseUploadType
            }
            console.log(liseReg);
            // const newLiseReg = new Lisereg(liseReg)
            // await newLiseReg.save()
            // response.status(201).json(newLiseReg)
        }
        if (invoiceType && invoiceDate && invoiceNumber && submissionDate) {
            console.log('you are in submission date');

            const checkInvoiceNumber = await Lisereg.findOne({ invoiceNumber })
            if (checkInvoiceNumber) {
                return response.send({ message: "409, Invoice Number already exists" })
            }
            liseReg = {
                invoiceType, invoiceDate, invoiceNumber, submissionDate
            }
            // const newLiseReg = new Lisereg(liseReg)
            // await newLiseReg.save()
            // response.status(201).json(newLiseReg)
        }
        if (branch && company && executive && state) {
            console.log('you are in branch, Done!!');
            liseReg = {
                company, executive, branch, state, created_at
            }
            // console.log(liseReg);
        }
        // console.log(liseReg); return;
        console.log('finish');
        // console.log(regNo);
        newLiseReg = await Lisereg.findOneAndUpdate({ regNo: lastInsertedId[0].regNo }, liseReg, { new: true })
        response.status(201).json(newLiseReg)

    } catch (error) {
        next(error)
    }
}

export const liseRegUpdateById = async (request, response, next) => {
    try {
        const liseRegId = request.params.id
        const checkLiseRegId = await Lisereg.findById({ _id: liseRegId })
        if (!checkLiseRegId) {
            response.status(404).json("Given lisereg id doesn't exists")
        }

        const data = request.body

        let { regNo, rate, docReqDate, docReqFollow, docReviewDate, docRemark, docStatus, imagetypedoc, appliedDate, applicationStatus, applicationRemark, acknowledgeType, challlanFees, challanNumber, challanDate, directExpenses, challanUploadType, inDirectExpenses, totalExpenses, licenseNumber, dateOfIssue, expireDate, renewalDate, licenseUploadType, invoiceType, invoiceDate, invoiceNumber, submissionDate, status, company, executive, state, branch, created_at
        } = data

        let docImageUrl, ackImageUrl, challanImageUrl, licImageUrl, formattedDocName, formattedAckName, formattedChallanName, formattedLicName, documents, acknowledge, licenseUpload, challanUpload, newLiseReg, liseReg;

        console.log(data);
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

        const url = request.protocol + '://' + request.get('host');
        if (request.files?.documents !== undefined && request.files?.documents[0] !== undefined) {
            documents = request.files.documents[0];
            if (documents) {
                formattedDocName = Date.now() + documents.originalname.split(' ').join('-');
                await sharp(documents.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedDocName);
                docImageUrl = url + '/' + imageDirectory + formattedDocName;
            }
        }
        if (request.files?.acknowledge !== undefined && request.files.acknowledge[0] !== undefined) {
            acknowledge = request.files.acknowledge[0];
            if (acknowledge) {
                formattedAckName = Date.now() + acknowledge.originalname.split(' ').join('-');
                await sharp(acknowledge.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedAckName);
                ackImageUrl = url + '/' + imageDirectory + formattedAckName;
            }
        }
        if (request.files?.licenseUpload !== undefined && request.files.licenseUpload[0] !== undefined) {
            licenseUpload = request.files.licenseUpload[0];
            if (licenseUpload) {
                formattedLicName = Date.now() + licenseUpload.originalname.split(' ').join('-');
                await sharp(licenseUpload.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedLicName);
                licImageUrl = url + '/' + imageDirectory + formattedLicName;
            }
        }
        if (request.files?.challanUpload !== undefined && request.files.challanUpload[0] !== undefined) {
            challanUpload = request.files.challanUpload[0];
            if (challanUpload) {
                formattedChallanName = Date.now() + challanUpload.originalname.split(' ').join('-');
                await sharp(challanUpload.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedChallanName);
                challanImageUrl = url + '/' + imageDirectory + formattedChallanName;
            }
        }
        if (regNo && rate) {
            console.log('you are here');
            liseReg = {
                regNo, rate
            }
        }
        if (documents && docReqDate && docReqFollow && docReviewDate && docStatus && docRemark) {
            console.log('you are in docremark');
            liseReg = {
                documents: docImageUrl, docReqDate, docReqFollow, docReviewDate, docStatus, docRemark, imagetypedoc
            }
        }
        if (applicationRemark && appliedDate && applicationStatus && acknowledge) {
            console.log('you are in ack');
            liseReg = {
                appliedDate, applicationStatus, applicationRemark, acknowledge: ackImageUrl, acknowledgeType
            }
        }
        if (challlanFees && challanNumber && challanDate && challanUpload && directExpenses && inDirectExpenses && totalExpenses) {
            console.log('you are in totalexpenses');
            // const checkChallanNumber = await Lisereg.findOne({ challanNumber })
            // if (checkChallanNumber) {
            //     return response.send({ message: "409, Challan Number already exists" })
            // }
            liseReg = {
                challlanFees, challanNumber, challanDate, challanUpload: challanImageUrl, directExpenses, inDirectExpenses, totalExpenses, challanUploadType
            }
        }
        if (dateOfIssue && expireDate && renewalDate && licenseUpload) {
            console.log('you are in licenseupload');
            liseReg = {
                licenseNumber, dateOfIssue, expireDate, renewalDate, licenseUpload: licImageUrl, licenseUploadType
            }
            console.log(liseReg);
        }
        if (invoiceType && invoiceDate && invoiceNumber && submissionDate) {
            console.log('you are in submission date');

            liseReg = {
                invoiceType, invoiceDate, invoiceNumber, submissionDate
            }
        }
        if (branch && company && executive && state) {
            console.log('you are in branch, Done!!');
            liseReg = {
                company, executive, branch, state, created_at
            }
        }
        console.log('finish');
        newLiseReg = await Lisereg.findByIdAndUpdate({ _id: liseRegId }, liseReg, { new: true })
        response.status(201).json(newLiseReg)

    } catch (error) {
        next(error)
    }
}


export const liseRegGetting = async (requxest, response, next) => {
    try {
        const liseReg = await Lisereg.aggregate([
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "companyData"
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "executive",
                    foreignField: "_id",
                    as: "executiveData"
                },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData"
                },
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branch",
                    foreignField: "_id",
                    as: "branchData"
                }
            },
            {
                $project: {
                    _id: 1,
                    regNo: 1,
                    rate: 1,
                    documents: 1,
                    docReqDate: 1,
                    docReqFollow: 1,
                    docReviewDate: 1,
                    appliedDate: 1,
                    remark: 1,
                    acknowledge: 1,
                    challlanFees: 1,
                    challanNumber: 1,
                    challanDate: 1,
                    challanUpload: 1,
                    directExpenses: 1,
                    inDirectExpenses: 1,
                    totalExpenses: 1,
                    licenseNumber: 1,
                    dateOfIssue: 1,
                    renewalDate: 1,
                    expireDate: 1,
                    licenseUpload: 1,
                    invoiceType: 1,
                    invoiceDate: 1,
                    invoiceNumber: 1,
                    submissionDate: 1,
                    branchName: 1,
                    status: 1,
                    applicationStatus: 1,
                    docRemark: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    comapany: { $arrayElemAt: ["$companyData.companyname", 0] },
                    branch: { $arrayElemAt: ["$branchData.name", 0] },
                    createdAt: 1,
                    updatedAt: 1,
                }
            }

        ])
        response.status(201).json(liseReg)
    }
    catch (error) {
        next(error)
    }
}



export const liseRegHistoryFilter = async (request, response, next) => {
    try {
        const stateFilter = request.body.state;
        const companyFilter = request.body.company;
        const executiveFilter = request.body.executive;
        const branchFilter = request.body.branchname;
        const dateFilter = request.body.created_at;

        const matchStage = {};
        matchStage['status'] = { $eq: 0 }

        if (stateFilter !== undefined && dateFilter !== undefined && executiveFilter !== undefined && companyFilter !== undefined && branchFilter !== undefined && stateFilter !== "" && dateFilter !== "" && executiveFilter !== "" && companyFilter !== "" && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        // ------------- 4 Filter -----------------
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        // ------------ 3 Filter --------------
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            // Both state and createdAt are provided
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        // ------------------ 2 Filter ----------------

        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (stateFilter !== undefined && stateFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (stateFilter !== undefined && stateFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            // Only state is provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        }
        else if (companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString());
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString());
        }
        else if (companyFilter !== undefined && companyFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString());
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (branchFilter !== undefined && branchFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        // ------------------ 1 Filter ----------------------
        else if (stateFilter !== undefined && stateFilter !== "") {
            // Only state is provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        }
        else if (companyFilter !== undefined && companyFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (branchFilter !== undefined && branchFilter !== "") {
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())
        }
        else if (dateFilter !== undefined && dateFilter !== "") {

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }

        // console.log(matchStage);
        const filter = await Lisereg.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "executive",
                    foreignField: "_id",
                    as: "executiveData",
                },
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "companyData",
                },
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branchname",
                    foreignField: "_id",
                    as: "branchData",
                },
            },
            {
                $project: {
                    _id: 1,
                    approvedate: 1,
                    approvalStatus: 1,
                    sentData: 1,
                    created_at: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.name", 0] },
                    branchname: { $arrayElemAt: ["$branchData.name", 0] },
                }
            }

        ]);

        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
};




// **************************** ------DASHBOARD------- *************************

export const dashboard = async (request, response, next) => {

}


// ************************ --------- Company ---------- **********************


// ************************ --------- Company Create ---------- **********************

// export const companyCreate = async (request, response, next) => {
//     try {
//         const data = request.body
//         const {
//             companyregistration, companyregistrationdetails, companyregistrationremark, companycin, companycindetails, companycinremark, companyissuedplace, companyissuedplacedetails, companyissuedplaceremark, companyauthority, companyauthoritydetails, companyauthorityremark, companyregistrationdate, companypan, companypandetails, companypanremark, companytan, companytandetails, companytanremark, companytin, companytindetails, companytinremark, companygst, companygstdetails, companygstremark, RegistrationB1, RegistrationB2, RegistrationB3, created_at, updated_at
//         } = data
//         let dataB1, dataB2, dataB3

//         const uploadImage = async (imageFile) => {
//             const url = request.protocol + '://' + request.get('host');
//             const uploadsDirectory = './data/uploads/';
//             const imageDirectory = 'images/';
//             // return await Promise.all(imageFile.map(async (img) => {
//             fs.access(uploadsDirectory, (err) => {
//                 if (err) {
//                     fs.mkdirSync(uploadsDirectory, { recursive: true });
//                 }
//             });
//             fs.access(uploadsDirectory + imageDirectory, (err) => {
//                 if (err) {
//                     fs.mkdirSync(uploadsDirectory + imageDirectory, { recursive: true });
//                 }
//             });
//             const formattedImageFileName = Date.now() + '-' + imageFile.originalname.split(' ').join('-');
//             const imageUrl = url + '/' + imageDirectory + formattedImageFileName;
//             console.log(imageUrl);
//             const imagePath = uploadsDirectory + imageDirectory + formattedImageFileName;
//             await sharp(imageFile.buffer).resize({ width: 600 }).toFile(imagePath);
//             return imageUrl;
//             // }))
//         };

//         // const images = request.files
//         // console.log(images.length);
//         // images.forEach(image => {
//         //     return uploadImage(image)
//         // })

//         if (RegistrationB1.length > 0) {
//             dataB1 = RegistrationB1.map(item => {
//                 return {
//                     name: item.name,
//                     nameimage: item.nameimage,
//                     details: item.details,
//                     remarks: item.remarks,
//                     din: item.din,
//                     dindetails: item.dindetails,
//                     dinremark: item.dinremark,
//                     dinimage: item.dinimage,
//                     pan: item.pan,
//                     pandetails: item.pandetails,
//                     panremark: item.panremark,
//                     panimage: item.panimage,
//                     aadhaar: item.aadhaar,
//                     aadhaardetails: item.aadhaardetails,
//                     aadhaarremark: item.aadhaarremark,
//                     aadhaarimage: item.aadhaarimage,
//                     mobile: item.mobile,
//                     mobiledetail: item.mobiledetail,
//                     mobileremark: item.mobileremark,
//                     email: item.email,
//                     emaildetails: item.emaildetails,
//                     emailremark: item.emailremark
//                 };
//             });
//             console.log(dataB1);
//         }
//         if (RegistrationB2.length > 0) {
//             dataB2 = RegistrationB2.map(function (item) {
//                 return {
//                     name: item.name,
//                     details: item.details,
//                     image: uploadImage(request.files.find(img => img.fieldname === "image")),
//                     remarks: item.remarks,
//                     designation: item.designation,
//                     designationdetails: item.designationdetails,
//                     designationimage: uploadImage(request.files[10]),
//                     designationremark: item.designationremark,
//                     pan: item.pan,
//                     pandetails: item.pandetails,
//                     panimage: uploadImage(request.files[11]),
//                     panremark: item.panremark,
//                     aadhaar: item.aadhaar,
//                     aadhaardetails: item.aadhaardetails,
//                     aadhaarimage: uploadImage(request.files[12]),
//                     aadhaarremark: item.aadhaarremark,
//                     mobile: item.mobile,
//                     mobiledetail: item.mobiledetail,
//                     mobileremark: item.mobileremark,
//                     email: item.email,
//                     emaildetails: item.emaildetails,
//                     emailremark: item.emailremark,
//                     authletter: item.authletter,
//                     authletterdetails: item.authletterdetails,
//                     authletterremark: item.authletterremark
//                 };
//             });
//             console.log(dataB2);
//         }

//         if (RegistrationB3.length > 0) {
//             dataB3 = RegistrationB3.map(item => {
//                 return {
//                     name: item.name,
//                     details: item.details,
//                     remarks: item.remarks,
//                     pan: item.pan,
//                     pandetails: item.pandetails,
//                     panremark: item.panremark,
//                     aadhaar: item.aadhaar,
//                     aadhaardetails: item.aadhaardetails,
//                     aadhaarremark: item.aadhaarremark,
//                     mobile: item.mobile,
//                     mobiledetail: item.mobiledetail,
//                     mobileremark: item.mobileremark,
//                     email: item.email,
//                     emaildetails: item.emaildetails,
//                     emailremark: item.emailremark,
//                     prefferd: item.prefferd,
//                     prefferdetails: item.prefferdetails,
//                     prefferdremark: item.prefferdremark
//                 };
//             });
//             console.log(dataB3);
//         }


//         const company = {
//             companyregistration, companyregistrationdetails, companyregistrationimage: await uploadImage(request.files[1]), companyregistrationremark, companycin, companycindetails, companyciniamge: await uploadImage(request.files[2]), companycinremark, companyissuedplace, companyissuedplacedetails, companyissuedplaceimage: await uploadImage(request.files[3]), companyissuedplaceremark, companyauthority, companyauthoritydetails, companyauthorityimage: await uploadImage(request.files[4]), companyauthorityremark, companyregistrationdate, companypan, companypandetails, companypanimage: await uploadImage(request.files[5]), companypanremark, companytan, companytandetails, companytanimage: await uploadImage(request.files[6]), companytanremark, companytin, companytindetails, companytinimage: await uploadImage(request.files[7]), companytinremark, companygst, companygstdetails, companygstimage: await uploadImage(request.files[8]), companygstremark, RegistrationB1, RegistrationB2, RegistrationB3, created_at, updated_at

//         }
//         const newCompany = new Registration(company)
//         await newCompany.save()
//         response.status(201).json(newCompany)
//     } catch (error) {
//         next(error)
//     }

// }



// export const companyCreate = async (request, response, next) => {
//     try {
//         const data = request.body;
//         const {
//             companyregistration, companyregistrationdetails, companyregistrationremark, companycin, companycindetails, companycinremark, companyissuedplace, companyissuedplacedetails, companyissuedplaceremark, companyauthority, companyauthoritydetails, companyauthorityremark, companyregistrationdate, companypan, companypandetails, companypanremark, companytan, companytandetails, companytanremark, companytin, companytindetails, companytinremark, companygst, companygstdetails, companygstremark, RegistrationB1, RegistrationB2, RegistrationB3, created_at, updated_at
//         } = data;

//         const uploadImages = async (files) => {
//             if (!files) return [];

//             const url = request.protocol + '://' + request.get('host');
//             const uploadsDirectory = './data/uploads/';
//             const imageDirectory = 'images/';

//             return await Promise.all(files.map(async (imageFile) => {
//                 fs.access(uploadsDirectory, (err) => {
//                     if (err) {
//                         fs.mkdirSync(uploadsDirectory, { recursive: true });
//                     }
//                 });
//                 fs.access(uploadsDirectory + imageDirectory, (err) => {
//                     if (err) {
//                         fs.mkdirSync(uploadsDirectory + imageDirectory, { recursive: true });
//                     }
//                 });
//                 const formattedImageFileName = Date.now() + '-' + imageFile.originalname.split(' ').join('-');
//                 const imageUrl = url + '/' + imageDirectory + formattedImageFileName;
//                 const imagePath = uploadsDirectory + imageDirectory + formattedImageFileName;
//                 await sharp(imageFile.buffer).resize({ width: 600 }).toFile(imagePath);
//                 return imageUrl;
//             }));
//         };

//         const images = [
//             request.files?.[1],
//             request.files?.[2],
//             request.files?.[3],
//             request.files?.[4],
//             request.files?.[5],
//             request.files?.[6],
//             request.files?.[7],
//             request.files?.[8],
//         ];

//         const uploadedImages = await uploadImages(images);

//         const company = {
//             companyregistration, companyregistrationdetails, companyregistrationimage: uploadedImages[0], companyregistrationremark, companycin, companycindetails, companyciniamge: uploadedImages[1], companycinremark, companyissuedplace, companyissuedplacedetails, companyissuedplaceimage: uploadedImages[2], companyissuedplaceremark, companyauthority, companyauthoritydetails, companyauthorityimage: uploadedImages[3], companyauthorityremark, companyregistrationdate, companypan, companypandetails, companypanimage: uploadedImages[4], companypanremark, companytan, companytandetails, companytanimage: uploadedImages[5], companytanremark, companytin, companytindetails, companytinimage: uploadedImages[6], companytinremark, companygst, companygstdetails, companygstimage: uploadedImages[7], companygstremark, RegistrationB1, RegistrationB2, RegistrationB3, created_at, updated_at
//         };

//         const newCompany = new Registration(company);
//         await newCompany.save();
//         response.status(201).json(newCompany);
//     } catch (error) {
//         next(error);
//     }
// };











// const companyregistrationimage = request.files.companyregistrationimage ? request.files.companyregistrationimage[0] : null;
// const companyciniamge = request.files.companyciniamge ? request.files.companyciniamge[0] : null;
// const companyauthorityimage = request.files.companyauthorityimage ? request.files.companyauthorityimage[0] : null;
// const companyissuedplaceimage = request.files.companyissuedplaceimage ? request.files.companyissuedplaceimage[0] : null;
// const companytanimage = request.files.companytanimage ? request.files.companytanimage[0] : null;
// const companytinimage = request.files.companytinimage ? request.files.companytinimage[0] : null;
// const companygstimage = request.files.companygstimage ? request.files.companygstimage[0] : null;
// const companypanimage = request.files.companypanimage ? request.files.companypanimage[0] : null;

// export const companyCreate = async (request, response, next) => {
//     try {
//         const data = request.body;
//         const { /* destructure properties from data */ } = data;

//         if (!request.files) {
//             throw new Error("No files uploaded");
//         }

//         // Assuming `RegistrationB1`, `RegistrationB2`, and `RegistrationB3` are arrays
//         let dataB1, dataB2, dataB3;

//         const uploadImage = async (imageFile) => {
//             // Check if imageFile exists
//             if (!imageFile) {
//                 return null;
//             }

//             const url = request.protocol + '://' + request.get('host');
//             const uploadsDirectory = './data/uploads/';
//             const imageDirectory = 'images/';

//             // Ensure directories exist
//             fs.mkdirSync(uploadsDirectory, { recursive: true });
//             fs.mkdirSync(uploadsDirectory + imageDirectory, { recursive: true });

//             const formattedImageFileName = Date.now() + '-' + imageFile.originalname.split(' ').join('-');
//             const imageUrl = url + '/' + imageDirectory + formattedImageFileName;
//             const imagePath = uploadsDirectory + imageDirectory + formattedImageFileName;

//             await sharp(imageFile.buffer).resize({ width: 600 }).toFile(imagePath);

//             return imageUrl;
//         };

//         // Process images
//         const companyregistrationimage = await uploadImage(request.files.companyregistrationimage);
//         const companyciniamge = await uploadImage(request.files.companyciniamge);
//         // Repeat for other fields...

//         const company = {
//             companyregistration, companyregistrationdetails, companyregistrationimage,
//             companyregistrationremark, companycin, companycindetails, companyciniamge,
//             companycinremark, companyissuedplace, companyissuedplacedetails,
//             // Include other properties...
//             RegistrationB1: dataB1, RegistrationB2: dataB2, RegistrationB3: dataB3,
//             created_at, updated_at
//         };

//         const newCompany = new Registration(company);
//         await newCompany.save();
//         response.status(201).json(newCompany);
//     } catch (error) {
//         next(error);
//     }
// };

// export const companyCreate = async (request, response, next) => {
//     try {
//         const data = request.body;
//         const {
//             companyregistration, companyregistrationdetails, companyregistrationremark, companycin, companycindetails, companycinremark, companyissuedplace, companyissuedplacedetails, companyissuedplaceremark, companyauthority, companyauthoritydetails, companyauthorityremark, companyregistrationdate, companypan, companypandetails, companypanremark, companytan, companytandetails, companytanremark, companytin, companytindetails, companytinremark, companygst, companygstdetails, companygstremark, RegistrationB1, RegistrationB2, RegistrationB3, created_at, updated_at
//         } = data

//         if (!request.files) {
//             throw new Error("No files uploaded");
//         }

//         let dataB1, dataB2, dataB3;

//         const uploadImage = async (imageFile) => {
//             if (!imageFile) {
//                 return null;
//             }

//             const url = request.protocol + '://' + request.get('host');
//             const uploadsDirectory = './data/uploads/';
//             const imageDirectory = 'images/';

//             fs.mkdirSync(uploadsDirectory, { recursive: true });
//             fs.mkdirSync(uploadsDirectory + imageDirectory, { recursive: true });

//             const formattedImageFileName = Date.now() + '-' + imageFile.originalname.split(' ').join('-');
//             const imageUrl = url + '/' + imageDirectory + formattedImageFileName;
//             const imagePath = uploadsDirectory + imageDirectory + formattedImageFileName;

//             await sharp(imageFile.buffer).resize({ width: 600 }).toFile(imagePath);

//             return imageUrl;
//         };

//         // Process images for each item in RegistrationB2
//         if (RegistrationB2 && RegistrationB2.length > 0) {
//             dataB2 = await Promise.all(RegistrationB2.map(async (item) => {
//                 console.log(item);
//                 const imageFields = ['designationimage', 'panimage', 'aadhaarimage']; // Add other image fields here
//                 const processedItem = { ...item }; // Copy the item object
//                 for (const field of imageFields) {
//                     if (item[field]) {
//                         processedItem[field] = await uploadImage(request.files[field]);
//                     }
//                 }

//                 return processedItem;
//             }));
//         }

//         // Other parts of the code remain the same

//         const company = {
//             companyregistration, companyregistrationdetails, companyregistrationimage: uploadImage(request.files[0]),
//             companyregistrationremark, companycin, companycindetails, companyciniamge : uploadImage(request.files[1]),
//             companycinremark, companyissuedplace, companyissuedplacedetails,
//             // Include other properties...
//             RegistrationB1: dataB1, RegistrationB2: dataB2, RegistrationB3: dataB3,
//             created_at, updated_at
//         };

//         const newCompany = new Registration(company);
//         await newCompany.save();
//         response.status(201).json(newCompany);
//     } catch (error) {
//         next(error);
//     }
// };



// export const createCompanyRegistration = async (request, response, next) => {
//     try {
//         const data = request.body;
//         const {
//             // A Starts
//             companyname, companydetails, companyremark, companyaddress, companystate, companydistrict, companypin, comapnyaddressdetails, companyaddressremark, companytype, companytypedetails, companytyperemark, companycategory, companycategorydetails, companycategoryremark, companynatureofbusiness, companynatureofbusinessdetails, companynatureofbusinessremark,
//             // B Starts
//             companyregistration, companyregistrationdetails, companyregistrationremark, companycin, companycindetails, companycinremark, companyissuedplace, companyissuedplacedetails, companyissuedplaceremark, companyauthority, companyauthoritydetails, companyauthorityremark, companyregistrationdate, companypan, companypandetails, companypanremark, companytan, companytandetails, companytanremark, companytin, companytindetails, companytinremark, companygst, companygstdetails, companygstremark, RegistrationB1, RegistrationB2, RegistrationB3,
//             // C Starts
//             ClientcontactC1, ClientcontactC2, ClientcontactC3, ClientcontactC4,
//             // D Starts
//             pfnumber, pfdetails, pfdremark, doc, pfaddress, pfstate, pfdistrict, pfpin, pfaddressdetails, OtherRegsitrationD1PFsubcodes, OtherRegsitrationD1ESIsubcodes, OtherRegsitrationD3NSP, OtherRegsitrationD3FL, OtherRegsitrationD3OTP, OtherRegsitrationD3WOE, OtherRegsitrationD3TD, OtherRegsitrationD3MSME, OtherRegsitrationD3BOCW, OtherRegsitrationD3IMW, esinumber, esidetails, esidremark, esidoc, esiaddress, esistate, esidistrict, esipin, esiaddressdetails, esiaddressremark, registrationD3, registrationD3details, registrationD3remark, doregistrationD3, doeregistrationD3, doddrregistrationD3, managernameD3, managernameD3details, managernameD3remark, noeD3, noemD3, noefD3, issueauthfD3, issueauthfD3details, issueauthfD3remark, fpD3, fpD3details, fpD3remark, doapp, issueauthfpD3, issueauthfpD3details, issueauthfpD3remark, powerfpD3, powerfpD3details, powerfpD3remark, powerhpfpD3, powerhpfpD3details, powerhpfpD3remark, registrationlwfD3, registrationlwfD3details, registrationlwfD3remark, doregistrationlwfD3, registrationptrD3, registrationptrD3details, registrationptrD3remark, doregistrationptrD3,
//         } = data;
//         // pfnumber, pfaddressimage

//         const uploadImage = async (imageFile) => {
//             if (!imageFile) {
//                 return null; // Return null if image is not provided
//             }
//             const url = request.protocol + '://' + request.get('host');
//             const uploadsDirectory = './data/uploads/';
//             const imageDirectory = 'images/';
//             const formattedImageFileName = Date.now() + '-' + imageFile.originalname.split(' ').join('-');
//             const imageUrl = url + '/' + imageDirectory + formattedImageFileName;
//             // console.log(imageUrl);
//             const imagePath = uploadsDirectory + imageDirectory + formattedImageFileName;
//             await sharp(imageFile.buffer).resize({ width: 600 }).toFile(imagePath);
//             return imageUrl;
//         };

//         // ***********************-------- B Dynamic Image Handling ----------***********************

//         let dataB1, dataB2, dataB3
//         // Process RegistrationB1
//         if (RegistrationB1 !== undefined && RegistrationB1.length > 0) {
//             dataB1 = await Promise.all(RegistrationB1.map(async (item, index) => ({
//                 ...item,
//                 nameimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB1[${index}][nameimage]`)),
//                 dinimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB1[${index}][dinimage]`)),
//                 panimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB1[${index}][panimage]`)),
//                 aadhaarimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB1[${index}][aadhaarimage]`)),
//             })));
//         }
//         // Process RegistrationB2
//         if (RegistrationB2 !== undefined && RegistrationB2.length > 0) {
//             dataB2 = await Promise.all(RegistrationB2.map(async (item, index) => ({
//                 ...item,
//                 image: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB2[${index}][image]`)),
//                 designationimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB2[${index}][designationimage]`)),
//                 panimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB2[${index}][panimage]`)),
//                 aadhaarimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB2[${index}][aadhaarimage]`)),
//             })));
//         }
//         // Process RegistrationB3
//         if (RegistrationB3 !== undefined && RegistrationB3.length > 0) {
//             dataB3 = await Promise.all(RegistrationB3.map(async (item, index) => ({
//                 ...item,
//                 panimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB3[${index}][panimage]`)),
//                 aadhaarimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB3[${index}][aadhaarimage]`)),
//             })));
//         }

//         // ***********************-------- C Dynamic Image Handling ----------***********************

//         let clientDataC1, clientDataC2, clientDataC3, clientDataC4
//         if (ClientcontactC1 !== undefined && ClientcontactC1.length > 0) {
//             clientDataC1 = await Promise.all(ClientcontactC1.map(async (item, index) => {
//                 return {
//                     ...item,
//                     nameimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC1[${index}][nameimage]`)),
//                     designationimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC1[${index}][designationimage]`))
//                 }
//             }))
//         }
//         if (ClientcontactC2 !== undefined && ClientcontactC2.length > 0) {
//             clientDataC2 = await Promise.all(ClientcontactC2.map(async (item, index) => {
//                 return {
//                     ...item,
//                     nameimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC2[${index}][nameimage]`)),
//                     designationimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC2[${index}][designationimage]`))
//                 }
//             }))
//         }
//         if (ClientcontactC3 !== undefined && ClientcontactC3.length > 0) {
//             clientDataC3 = await Promise.all(ClientcontactC3.map(async (item, index) => {
//                 return {
//                     ...item,
//                     nameimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC3[${index}][nameimage]`)),
//                     designationimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC3[${index}][designationimage]`))
//                 }
//             }))
//         }
//         if (ClientcontactC4 !== undefined && ClientcontactC4.length > 0) {
//             clientDataC4 = await Promise.all(ClientcontactC4.map(async (item, index) => {
//                 return {
//                     ...item,
//                     nameimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC4[${index}][nameimage]`)),
//                     designationimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC4[${index}][designationimage]`))
//                 }
//             }))
//         }

//         // ***********************-------- D Dynamic Image Handling ----------***********************

//         let dataPFsubcodes, dataESIsubcodes, dataFL, dataNSP, dataOTP, dataWOE, dataTD, dataMSME, dataIMW, dataBOCW
//         if (OtherRegsitrationD1PFsubcodes !== undefined && OtherRegsitrationD1PFsubcodes.length > 0) {
//             dataPFsubcodes = await Promise.all(OtherRegsitrationD1PFsubcodes.map(async (item, index) => {
//                 return {
//                     ...item,
//                     regimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1PFsubcodes[${index}][regimage]`)),
//                     docimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1PFsubcodes[${index}][docimage]`)),
//                     offaddressimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1PFsubcodes[${index}][offaddressimage]`))
//                 }
//             }))
//         }
//         if (OtherRegsitrationD1ESIsubcodes !== undefined && OtherRegsitrationD1ESIsubcodes.length > 0) {
//             dataESIsubcodes = await Promise.all(OtherRegsitrationD1ESIsubcodes.map(async (item, index) => {
//                 return {
//                     ...item,
//                     esiimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1ESIsubcodes[${index}][esiimage]`)),
//                     esidocimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1ESIsubcodes[${index}][esidocimage]`)),
//                     esioffaddressimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1ESIsubcodes[${index}][esioffaddressimage]`))
//                 }
//             }))
//         }
//         if (OtherRegsitrationD3FL !== undefined && OtherRegsitrationD3FL.length > 0) {
//             dataFL = await Promise.all(OtherRegsitrationD3FL.map(async (item, index) => {
//                 return {
//                     ...item,
//                     managerlicenseimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3FL[${index}][managerlicenseimage]`)),
//                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3FL[${index}][issuingauthimage]`)),
//                 }
//             }))
//         }
//         if (OtherRegsitrationD3NSP !== undefined && OtherRegsitrationD3NSP.length > 0) {
//             dataNSP = await Promise.all(OtherRegsitrationD3NSP.map(async (item, index) => {
//                 return {
//                     ...item,
//                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3NSP[${index}][issuingauthimage]`)),
//                 }
//             }))
//         }
//         if (OtherRegsitrationD3OTP !== undefined && OtherRegsitrationD3OTP.length > 0) {
//             dataOTP = await Promise.all(OtherRegsitrationD3OTP.map(async (item, index) => {
//                 return {
//                     ...item,
//                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3OTP[${index}][issuingauthimage]`)),
//                 }
//             }))
//         }
//         if (OtherRegsitrationD3WOE !== undefined && OtherRegsitrationD3WOE.length > 0) {
//             dataWOE = await Promise.all(OtherRegsitrationD3WOE.map(async (item, index) => {
//                 return {
//                     ...item,
//                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3WOE[${index}][issuingauthimage]`)),
//                 }
//             }))
//         }
//         if (OtherRegsitrationD3TD !== undefined && OtherRegsitrationD3TD.length > 0) {
//             dataTD = await Promise.all(OtherRegsitrationD3TD.map(async (item, index) => {
//                 return {
//                     ...item,
//                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3TD[${index}][issuingauthimage]`)),
//                 }
//             }))
//         }
//         if (OtherRegsitrationD3MSME !== undefined && OtherRegsitrationD3MSME.length > 0) {
//             dataMSME = await Promise.all(OtherRegsitrationD3MSME.map(async (item, index) => {
//                 return {
//                     ...item,
//                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3MSME[${index}][issuingauthimage]`)),
//                 }
//             }))
//         }
//         if (OtherRegsitrationD3BOCW !== undefined && OtherRegsitrationD3BOCW.length > 0) {
//             dataBOCW = await Promise.all(OtherRegsitrationD3BOCW.map(async (item, index) => {
//                 return {
//                     ...item,
//                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3BOCW[${index}][issuingauthimage]`)),
//                 }
//             }))
//         }
//         if (OtherRegsitrationD3IMW !== undefined && OtherRegsitrationD3IMW.length > 0) {
//             dataIMW = await Promise.all(OtherRegsitrationD3IMW.map(async (item, index) => {
//                 return {
//                     ...item,
//                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3IMW[${index}][issuingauthimage]`)),
//                 }
//             }))
//         }


//         // Upload company images
//         const company = {
//             // A Starts
//             companyimage: await uploadImage(request.files.find(img => img.fieldname === "companyimage")),
//             companyaddressimage: await uploadImage(request.files.find(img => img.fieldname === "companyaddressimage")),
//             companytypeimage: await uploadImage(request.files.find(img => img.fieldname === "companytypeimage")),
//             companycategoryimage: await uploadImage(request.files.find(img => img.fieldname === "companycategoryimage")),
//             companynatureofbusinessimage: await uploadImage(request.files.find(img => img.fieldname === "companynatureofbusinessimage")),
//             companyname, companydetails, companyremark, companyaddress, companystate, companydistrict, companypin, comapnyaddressdetails, companyaddressremark, companytype, companytypedetails, companytyperemark, companycategory, companycategorydetails, companycategoryremark, companynatureofbusiness, companynatureofbusinessdetails, companynatureofbusinessremark,
//             // B Starts
//             companyregistrationimage: await uploadImage(request.files.find(img => img.fieldname === "companyregistrationimage")),
//             companyciniamge: await uploadImage(request.files.find(img => img.fieldname === "companyciniamge")),
//             companyissuedplaceimage: await uploadImage(request.files.find(img => img.fieldname === "companyissuedplaceimage")),
//             companyauthorityimage: await uploadImage(request.files.find(img => img.fieldname === "companyauthorityimage")),
//             companypanimage: await uploadImage(request.files.find(img => img.fieldname === "companypanimage")),
//             companytanimage: await uploadImage(request.files.find(img => img.fieldname === "companytanimage")),
//             companytinimage: await uploadImage(request.files.find(img => img.fieldname === "companytinimage")),
//             companygstimage: await uploadImage(request.files.find(img => img.fieldname === "companygstimage")),
//             companyregistration, companyregistrationdetails, companyregistrationremark, companycin, companycindetails, companycinremark, companyissuedplace, companyissuedplacedetails, companyissuedplaceremark, companyauthority, companyauthoritydetails, companyauthorityremark, companyregistrationdate, companypan, companypandetails, companypanremark, companytan, companytandetails, companytanremark, companytin, companytindetails, companytinremark, companygst, companygstdetails, companygstremark,
//             RegistrationB1: dataB1,
//             RegistrationB2: dataB2,
//             RegistrationB3: dataB3,
//             // C Starts
//             ClientcontactC1: clientDataC1,
//             ClientcontactC2: clientDataC2,
//             ClientcontactC3: clientDataC3,
//             ClientcontactC4: clientDataC4,
//             // D Starts
//             pfimage: await uploadImage(request.files.find(img => img.fieldname === "pfimage")),
//             pfaddressimage: await uploadImage(request.files.find(img => img.fieldname === "pfaddressimage")),
//             esiimage: await uploadImage(request.files.find(img => img.fieldname === "esiimage")),
//             esiaddressimage: await uploadImage(request.files.find(img => img.fieldname === "esiaddressimage")),
//             registrationD3image: await uploadImage(request.files.find(img => img.fieldname === "registrationD3image")),
//             managernameD3image: await uploadImage(request.files.find(img => img.fieldname === "managernameD3image")),
//             issueauthfD3image: await uploadImage(request.files.find(img => img.fieldname === "issueauthfD3image")),
//             fpD3image: await uploadImage(request.files.find(img => img.fieldname === "fpD3image")),
//             issueauthfpD3image: await uploadImage(request.files.find(img => img.fieldname === "issueauthfpD3image")),
//             powerfpD3image: await uploadImage(request.files.find(img => img.fieldname === "powerfpD3image")),
//             powerhpfpD3image: await uploadImage(request.files.find(img => img.fieldname === "powerhpfpD3image")),
//             registrationlwfD3image: await uploadImage(request.files.find(img => img.fieldname === "registrationlwfD3image")),
//             registrationptrD3image: await uploadImage(request.files.find(img => img.fieldname === "registrationptrD3image")),
//             pfnumber, pfdetails, pfdremark, doc, pfaddress, pfstate, pfdistrict, pfpin, pfaddressdetails, esinumber, esidetails, esidremark, esidoc, esiaddress, esistate, esidistrict, esipin, esiaddressdetails, esiaddressremark, registrationD3, registrationD3details, registrationD3remark, doregistrationD3, doeregistrationD3, doddrregistrationD3, managernameD3, managernameD3details, managernameD3remark, noeD3, noemD3, noefD3, issueauthfD3, issueauthfD3details, issueauthfD3remark, fpD3, fpD3details, fpD3remark, doapp, issueauthfpD3, issueauthfpD3details, issueauthfpD3remark, powerfpD3, powerfpD3details, powerfpD3remark, powerhpfpD3, powerhpfpD3details, powerhpfpD3remark, registrationlwfD3, registrationlwfD3details, registrationlwfD3remark, doregistrationlwfD3, registrationptrD3, registrationptrD3details, registrationptrD3remark, doregistrationptrD3,
//             OtherRegsitrationD1PFsubcodes: dataPFsubcodes,
//             OtherRegsitrationD1ESIsubcodes: dataESIsubcodes,
//             OtherRegsitrationD3NSP: dataNSP,
//             OtherRegsitrationD3OTP: dataOTP,
//             OtherRegsitrationD3WOE: dataWOE,
//             OtherRegsitrationD3TD: dataTD,
//             OtherRegsitrationD3MSME: dataMSME,
//             OtherRegsitrationD3BOCW: dataBOCW,
//             OtherRegsitrationD3IMW: dataIMW,
//             OtherRegsitrationD3FL: dataFL,
//         };


//         // Save company data to database
//         const newCompany = new Company(company);
//         await newCompany.save();
//         response.status(201).json(newCompany);
//     } catch (error) {
//         next(error);
//     }



/** pradeep code*/
export const createCompanyRegistration = async (request, response, next) => {
    try {
        let data = request.body;
        let {
            // A Starts
            companyname, companydetails, companyremark, companyaddress, companystate, companydistrict, companypin, comapnyaddressdetails, companyaddressremark, companytype, companytypedetails, companytyperemark, companycategory, companycategorydetails, companycategoryremark, companynatureofbusiness, companynatureofbusinessdetails, companynatureofbusinessremark,
            // B Starts
            companyregistration, companyregistrationdetails, companyregistrationremark, companycin, companycindetails, companycinremark, companyissuedplace, companyissuedplacedetails, companyissuedplaceremark, companyauthority, companyauthoritydetails, companyauthorityremark, companyregistrationdate, companypan, companypandetails, companypanremark, companytan, companytandetails, companytanremark, companytin, companytindetails, companytinremark, companygst, companygstdetails, companygstremark, RegistrationB1, RegistrationB2, RegistrationB3,
            // C Starts
            ClientcontactC1, ClientcontactC2, ClientcontactC3, ClientcontactC4,
            // D Starts
            pfnumber, pfdetails, pfdremark, doc, pfaddress, pfstate, pfdistrict, pfpin, pfaddressdetails, OtherRegsitrationD1PFsubcodes, OtherRegsitrationD1ESIsubcodes, OtherRegsitrationD3NSP, OtherRegsitrationD3FL, OtherRegsitrationD3OTP, OtherRegsitrationD3WOE, OtherRegsitrationD3TD, OtherRegsitrationD3MSME, OtherRegsitrationD3BOCW, OtherRegsitrationD3IMW, esinumber, esidetails, esidremark, esidoc, esiaddress, esistate, esidistrict, esipin, esiaddressdetails, esiaddressremark, registrationD3, registrationD3details, registrationD3remark, doregistrationD3, doeregistrationD3, doddrregistrationD3, managernameD3, managernameD3details, managernameD3remark, noeD3, noemD3, noefD3, issueauthfD3, issueauthfD3details, issueauthfD3remark, fpD3, fpD3details, fpD3remark, doapp, issueauthfpD3, issueauthfpD3details, issueauthfpD3remark, powerfpD3, powerfpD3details, powerfpD3remark, powerhpfpD3, powerhpfpD3details, powerhpfpD3remark, registrationlwfD3, registrationlwfD3details, registrationlwfD3remark, doregistrationlwfD3, registrationptrD3, registrationptrD3details, registrationptrD3remark, doregistrationptrD3,
            // E Starts 
            isEngaged, isEngagedDet, isEngagedRemark, contLabRegNoE, contLabRegNoEDet, contLabRegNoERemark, dateOfRegistrationE, dateOfRegEDet, dateOfRegERemark, noOfContractEmployeesE, noOfContractEmpEDet, noOfContractEmpERemark, noOfContractorsE, noOfContractorsEDet, noOfContractorsERemark, nameOfContractorE1, nameOfContractorsE1Det, nameOfContractorsE1Remark, nameOfEstablishmentE1, nameOfEstablishmentE1Det, nameOfEstablishmentE1Remark, regAddContractorE1, regAddContractorE1Det, regAddContractorE1Remark, agreementExpiryDateE2, agreementExpiryDateE2Det, agreementExpiryDateE2Remark, agreementRenewalDateE2, agreementRenewalDateE2Det, agreementRenewalDateE2Remark, natureOfWorkAgreementE2, natureOfWorkAgreementE2Det, natureOfWorkAgreementE2Remark, noOfEmpDeployedAgreementE2, noOfEmpDeployedAgreementE2Det, noOfEmpDeployedAgreementE2Remark, companyTypeLabourE3, companyTypeLabourE3Det, companyTypeLabourE3Remark, contractLabourLicNoE3, contractLabourLicNoE3Det, contractLabourLicNoE3Remark, contractLicDateE3, contractLicDateE3Det, contractLicDateE3Remark, contractExpiryDateE3, contractExpiryDateE3Det, contractExpiryDateE3Remark, contractRenewalDueDateE3, contractRenewalDueDateE3Det, contractRenewalDueDateE3Remark, noOfWorkersContractE3, noOfWorkersContractE3Det, noOfWorkersContractE3Remark, panContractorsE3, panContractorsE3Det, panContractorsE3Remark, gstContractorsE3, gstContractorsE3Det, gstContractorsE3Remark, pfRegContractorsE3, pfRegContractorsE3Det, pfRegContractorsE3Remark, esicRegContractorsE3, esicRegContractorsE3Det, esicRegContractorsE3Remark, shopsandEstContractorsE3, shopsandEstContractorsE3Det, shopsandEstContractorsE3Remark, lwfRegContractorsE3, lwfRegContractorsE3Det, lwfRegContractorsE3Remark, profTaxContractorsE3, profTaxContractorsE3Det, profTaxContractorsE3Remark,
            // F Starts : in this renewalDateF52 was written 2 times as payload, so i removed one
            branchaddress, branchstate, branchdistrict, branchpin, contractorAddBranchFDet, contractorAddBranchFRemark, branchOpeningDateF, noOfEmpBranchF, managerNameF1, managerNameF1Det, managerNameF1Remark, managerMobNoF1, managerMobNoF1Det, managerMobNoF1Remark, managerEmailF1, managerEmailF1Det, managerEmailF1Remark, managerAadharNoF1, managerAadharNoF1Det, managerAadharNoF1Remark, managerPanF1, managerPanF1Det, managerPanF1Remark, shopsEstLicenseF2, shopsEstLicenseF2Det, shopsEstLicenseF2Remark, contractLabRegNoF5, contractLabRegNoF5Det, contractLabRegNoF5Remark, regDateContractorF5, coOfContractEmpF5, noOfContractorsF5, contractorNameF51, contractorNameF51Det, contractorNameF51Remark, establishmentNameF51, establishmentNameF51Det, establishmentNameF51Remark, regisocontractaddress, regisocontractstate, regisocontractdistrict, regisocontractpin, regAddContractorF51Det, regAddContractorF51Remark, expiryDateF52, renewalDateF52, natureOfWorkF52, natureOfWorkF52Det, natureOfWorkF52Remark, noOfEmpDeployedF52, companyTypeF53Det, companyTypeF53Remark, contractLabLicNoF53, contractLabLicNoF53Det, contractLabLicNoF53Remark, licenseDateF53, expiryDateF53, renewalDateF53, noOfWorkerF53, panF53, panF53Det, panF53Remark, gstF53, gstF53Det, gstF53Remark, pfRegF53, pfRegF53Det, pfRegF53Remark, esicRegF53, esicRegF53Det, esicRegF53Remark, shopsEstF53, shopsEstF53Det, shopsEstF53Remark, lwfRegF53, lwfRegF53Det, lwfRegF53Remark, profTaxF53, profTaxF53Det, profTaxF53Remark,
            // G Starts

            isLabourEngagedGDet, isLabourEngagedGRemark, noOfClientG, noOfClientGDet, noOfClientGRemark, clientG, clientGDet, clientGRemark, regOfficeAddClientG, regOfficeStateClientG, regOfficeDistClientG, regOfficePinClientG, regOfficeAddClientGDet, regOfficeAddClientGRemark, noOfLocContractWorkG11, noOfLocContractWorkG11Det, noOfLocContractWorkG11Remark, regAddOfClientG11, regStateOfClientG11, regDistOfClientG11, regPinOfClientG11, regAddOfClientG11Det, regAddOfClientG11Remark, agreementRefNoG12, agreementRefNoG12Det, agreementRefNoG12Remark, agreementDateG12, agreementDateG12Det, agreementDateG12Remark, agreementValidityG12, agreementValidityG12Det, agreementValidityG12Remark, noOfWorkersEngagedG12, noOfWorkersEngagedG12Det, noOfWorkersEngagedG12Remark, estCategoryG12, estCategoryG12Det, estCategoryG12Remark, isClraApplicableG12, noOfForm5G13, noOfForm5G13Det, noOfForm5G13Remark, form5DateG13, form5DateG13Det, form5DateG13Remark, workCommencedDateG13, workCommencedDateG13Det, workCommencedDateG13Remark, clraLicenseNoG13, clraLicenseNoG13Det, clraLicenseNoG13Remark, clraLicenseDateG13, clraLicenseDateG13Det, clraLicenseDateG13Remark, clraValidityG13, clraValidityG13Det, clraValidityG13Remark, clraRenewalDueG13, clraRenewalDueG13Det, clraRenewalDueG13Remark, clraNoOfContWorkersG13, clraNoOfContWorkersG13Det, clraNoOfContWorkersG13Remark, clraNoOfManagerRespG13, clraNoOfManagerRespG13Det, clraNoOfManagerRespG13Remark, clraLicenseFeeG13, clraLicenseFeeG13Det, clraLicenseFeeG13Remark, securityDepositG13, securityDepositG13Det, securityDepositG13Remark, contWorkCompletedDate, contWorkCompletedDateDet, contWorkCompletedDateRemark, contWorkComplitionNotice, contWorkComplitionNoticeDet, contWorkComplitionNoticeRemark, refundSecDepNotice, refundSecDepNoticeDet, refundSecDepNoticeRemark, licSurrenderedDate, licSurrenderedDateDet, licSurrenderedDateRemark
        } = data;
        // pfnumber, pfaddressimage
        let company, newCompany;
        const uploadImage = async (imageFile) => {
            if (!imageFile) {
                return null; // Return null if image is not provided
            }
            const url = request.protocol + '://' + request.get('host');
            const uploadsDirectory = './data/uploads/';
            const imageDirectory = 'images/';
            const formattedImageFileName = Date.now() + '-' + imageFile.originalname.split(' ').join('-');
            const imageUrl = url + '/' + imageDirectory + formattedImageFileName;
            // console.log(imageUrl);
            const imagePath = uploadsDirectory + imageDirectory + formattedImageFileName;
            await sharp(imageFile.buffer).resize({ width: 600 }).toFile(imagePath);
            return imageUrl;
        };

        // ***********************-------- B Dynamic Image Handling ----------***********************

        let dataB1, dataB2, dataB3
        // Process RegistrationB1
        if (RegistrationB1 !== undefined && RegistrationB1.length > 0) {
            dataB1 = await Promise.all(RegistrationB1.map(async (item, index) => ({
                ...item,
                nameimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB1[${index}][nameimage]`)),
                dinimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB1[${index}][dinimage]`)),
                panimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB1[${index}][panimage]`)),
                aadhaarimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB1[${index}][aadhaarimage]`)),
            })));
        }
        // Process RegistrationB2
        if (RegistrationB2 !== undefined && RegistrationB2.length > 0) {
            dataB2 = await Promise.all(RegistrationB2.map(async (item, index) => ({
                ...item,
                image: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB2[${index}][image]`)),
                designationimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB2[${index}][designationimage]`)),
                panimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB2[${index}][panimage]`)),
                aadhaarimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB2[${index}][aadhaarimage]`)),
            })));
        }
        // Process RegistrationB3
        if (RegistrationB3 !== undefined && RegistrationB3.length > 0) {
            dataB3 = await Promise.all(RegistrationB3.map(async (item, index) => ({
                ...item,
                panimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB3[${index}][panimage]`)),
                aadhaarimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB3[${index}][aadhaarimage]`)),
            })));
        }

        // ***********************-------- C Dynamic Image Handling ----------***********************

        let clientDataC1, clientDataC2, clientDataC3, clientDataC4
        if (ClientcontactC1 !== undefined && ClientcontactC1.length > 0) {
            clientDataC1 = await Promise.all(ClientcontactC1.map(async (item, index) => {
                return {
                    ...item,
                    nameimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC1[${index}][nameimage]`)),
                    designationimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC1[${index}][designationimage]`))
                }
            }))
        }
        if (ClientcontactC2 !== undefined && ClientcontactC2.length > 0) {
            clientDataC2 = await Promise.all(ClientcontactC2.map(async (item, index) => {
                return {
                    ...item,
                    nameimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC2[${index}][nameimage]`)),
                    designationimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC2[${index}][designationimage]`))
                }
            }))
        }
        if (ClientcontactC3 !== undefined && ClientcontactC3.length > 0) {
            clientDataC3 = await Promise.all(ClientcontactC3.map(async (item, index) => {
                return {
                    ...item,
                    nameimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC3[${index}][nameimage]`)),
                    designationimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC3[${index}][designationimage]`))
                }
            }))
        }
        if (ClientcontactC4 !== undefined && ClientcontactC4.length > 0) {
            clientDataC4 = await Promise.all(ClientcontactC4.map(async (item, index) => {
                return {
                    ...item,
                    nameimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC4[${index}][nameimage]`)),
                    designationimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC4[${index}][designationimage]`))
                }
            }))
        }

        // ***********************-------- D Dynamic Image Handling ----------***********************

        let dataPFsubcodes, dataESIsubcodes, dataFL, dataNSP, dataOTP, dataWOE, dataTD, dataMSME, dataIMW, dataBOCW
        if (OtherRegsitrationD1PFsubcodes !== undefined && OtherRegsitrationD1PFsubcodes.length > 0) {
            dataPFsubcodes = await Promise.all(OtherRegsitrationD1PFsubcodes.map(async (item, index) => {
                return {
                    ...item,
                    regimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1PFsubcodes[${index}][regimage]`)),
                    docimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1PFsubcodes[${index}][docimage]`)),
                    offaddressimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1PFsubcodes[${index}][offaddressimage]`))
                }
            }))
        }
        if (OtherRegsitrationD1ESIsubcodes !== undefined && OtherRegsitrationD1ESIsubcodes.length > 0) {
            dataESIsubcodes = await Promise.all(OtherRegsitrationD1ESIsubcodes.map(async (item, index) => {
                return {
                    ...item,
                    esiimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1ESIsubcodes[${index}][esiimage]`)),
                    esidocimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1ESIsubcodes[${index}][esidocimage]`)),
                    esioffaddressimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1ESIsubcodes[${index}][esioffaddressimage]`))
                }
            }))
        }
        if (OtherRegsitrationD3FL !== undefined && OtherRegsitrationD3FL.length > 0) {
            dataFL = await Promise.all(OtherRegsitrationD3FL.map(async (item, index) => {
                return {
                    ...item,
                    managerlicenseimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3FL[${index}][managerlicenseimage]`)),
                    issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3FL[${index}][issuingauthimage]`)),
                }
            }))
        }
        if (OtherRegsitrationD3NSP !== undefined && OtherRegsitrationD3NSP.length > 0) {
            dataNSP = await Promise.all(OtherRegsitrationD3NSP.map(async (item, index) => {
                return {
                    ...item,
                    issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3NSP[${index}][issuingauthimage]`)),
                }
            }))
        }
        if (OtherRegsitrationD3OTP !== undefined && OtherRegsitrationD3OTP.length > 0) {
            dataOTP = await Promise.all(OtherRegsitrationD3OTP.map(async (item, index) => {
                return {
                    ...item,
                    issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3OTP[${index}][issuingauthimage]`)),
                }
            }))
        }
        if (OtherRegsitrationD3WOE !== undefined && OtherRegsitrationD3WOE.length > 0) {
            dataWOE = await Promise.all(OtherRegsitrationD3WOE.map(async (item, index) => {
                return {
                    ...item,
                    issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3WOE[${index}][issuingauthimage]`)),
                }
            }))
        }
        if (OtherRegsitrationD3TD !== undefined && OtherRegsitrationD3TD.length > 0) {
            dataTD = await Promise.all(OtherRegsitrationD3TD.map(async (item, index) => {
                return {
                    ...item,
                    issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3TD[${index}][issuingauthimage]`)),
                }
            }))
        }
        if (OtherRegsitrationD3MSME !== undefined && OtherRegsitrationD3MSME.length > 0) {
            dataMSME = await Promise.all(OtherRegsitrationD3MSME.map(async (item, index) => {
                return {
                    ...item,
                    issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3MSME[${index}][issuingauthimage]`)),
                }
            }))
        }
        if (OtherRegsitrationD3BOCW !== undefined && OtherRegsitrationD3BOCW.length > 0) {
            dataBOCW = await Promise.all(OtherRegsitrationD3BOCW.map(async (item, index) => {
                return {
                    ...item,
                    issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3BOCW[${index}][issuingauthimage]`)),
                }
            }))
        }
        if (OtherRegsitrationD3IMW !== undefined && OtherRegsitrationD3IMW.length > 0) {
            dataIMW = await Promise.all(OtherRegsitrationD3IMW.map(async (item, index) => {
                return {
                    ...item,
                    issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3IMW[${index}][issuingauthimage]`)),
                }
            }))
        }

        // ***********************-------- F Dynamic Image Handling ----------***********************
        let dataF1branch, dataF1RLicense, dataF1FL, dataF1FP, dataF54NSP, dataF54OTP, dataF54WOE, dataF54TL

        if(F1branch!== undefined && F1branch.length > 0){
            dataF1branch = await Promise.all(F1branch.map(async (item, index)=>{
                return {
                    ...item,
                    image : await uploadImage(request.files.find(img => img.fieldname === `F1branch[${index}][image]`))
                }
            }))
        }
        if(F1RLicense !== undefined && F1RLicense.length > 0){
            dataF1RLicense = await Promise.all(F1RLicense.map(async (item, index)=>{
                return {
                    ...item,
                    managerlicenseimage : await uploadImage(request.files.find(img => img.fieldname === `F1RLicense[${index}][managerlicenseimage]`)),
                    issuingauthimage : await uploadImage(request.files.find(img => img.fieldname === `F1RLicense[${index}][issuingauthimage]`))
                }
            }))
        }
        if(F1FL  !== undefined && F1FL.length > 0){
            dataF1FL = await Promise.all(F1FL.map(async (item, index)=>{
                return {
                    ...item,
                    managerlicenseimage : await uploadImage(request.files.find(img => img.fieldname === `F1FL[${index}][managerlicenseimage]`)),
                    issuingauthimage : await uploadImage(request.files.find(img => img.fieldname === `F1FL[${index}][issuingauthimage]`))
                }
            }))
        }
        if(F1FP !== undefined && F1FP.length > 0){
            dataF1FP = await Promise.all(F1FP.map(async (item, index)=>{
                return {
                    ...item,
                    issuingauthimage : await uploadImage(request.files.find(img => img.fieldname === `F1FP[${index}][issuingauthimage]`))
                }
            }))
        }
        if(F54NSP !== undefined && F54NSP.length > 0){
            dataF54NSP = await Promise.all(F54NSP.map(async (item, index)=>{
                return {
                    ...item,
                    issuingauthimage : await uploadImage(request.files.find(img => img.fieldname === `F54NSP[${index}][issuingauthimage]`))
                }
            }))
        }
        if(F54OTP !== undefined && F54OTP.length > 0){
            dataF54OTP = await Promise.all(F54OTP.map(async (item, index)=>{
                return {
                    ...item,
                    issuingauthimage : await uploadImage(request.files.find(img => img.fieldname === `F54OTP[${index}][issuingauthimage]`))
                }
            }))
        }
        if(F54WOE !== undefined && F54WOE.length > 0){
            dataF54WOE = await Promise.all(F54WOE.map(async (item, index)=>{
                return {
                    ...item,
                    issuingauthimage : await uploadImage(request.files.find(img => img.fieldname === `F54WOE[${index}][issuingauthimage]`))
                }
            }))
        }
        if(F54TL !== undefined && F54TL.length > 0){
            dataF54TL = await Promise.all(F54TL.map(async (item, index)=>{
                return {
                    ...item,
                    issuingauthimage : await uploadImage(request.files.find(img => img.fieldname === `F54TL[${index}][issuingauthimage]`))
                }
            }))
        }
        // ***********************-------- G Dynamic Image Handling ----------***********************
        if(GCC4TL !== undefined && GCC4TL.length > 0){
            dataGCC4TL = await Promise.all(GCC4TL.map(async (item, index)=>{
                return {
                    ...item,
                    clientimage : await uploadImage(request.files.find(img => img.fieldname === `GCC4TL[${index}][clientimage]`)),
                    clientaddressimage : await uploadImage(request.files.find(img => img.fieldname === `GCC4TL[${index}][clientaddressimage]`))
                }
            }))
        }

        if (companyname && companyaddress && companystate && companydistrict && companypin && companytype && companycategory && companynatureofbusiness) {
            // A Starts
            company = {
                companyimage: await uploadImage(request.files.find(img => img.fieldname === "companyimage")),
                companyaddressimage: await uploadImage(request.files.find(img => img.fieldname === "companyaddressimage")),
                companytypeimage: await uploadImage(request.files.find(img => img.fieldname === "companytypeimage")),
                companycategoryimage: await uploadImage(request.files.find(img => img.fieldname === "companycategoryimage")),
                companynatureofbusinessimage: await uploadImage(request.files.find(img => img.fieldname === "companynatureofbusinessimage")),
                companyname, companydetails, companyremark, companyaddress, companystate, companydistrict, companypin, comapnyaddressdetails, companyaddressremark, companytype, companytypedetails, companytyperemark, companycategory, companycategorydetails, companycategoryremark, companynatureofbusiness, companynatureofbusinessdetails, companynatureofbusinessremark,
            }
            newCompany = new Companydata(company);
            await newCompany.save();
        }
        // console.log(companyregistration,companycin,companyissuedplace,companyauthority,companyregistrationdate,companypan,companytan,companytin,companygst)
        const lastInsertedcompany = await Companydata.find({}).sort({ '_id': -1 }).limit(1)
        const lastInsertedIdcompany = lastInsertedcompany.length > 0 ? lastInsertedcompany[0]._id : null;
        // console.log(companyregistration ,  companycin , companyissuedplace, companyauthority, companyregistrationdate, companypan, companytan, companytin, companygst);return;
        if (companyregistration && companycin && companyissuedplace && companyauthority && companyregistrationdate && companypan && companytan && companytin && companygst) {
            company = {
                // B Starts
                companyregistrationimage: await uploadImage(request.files.find(img => img.fieldname === "companyregistrationimage")),
                companyciniamge: await uploadImage(request.files.find(img => img.fieldname === "companyciniamge")),
                companyissuedplaceimage: await uploadImage(request.files.find(img => img.fieldname === "companyissuedplaceimage")),
                companyauthorityimage: await uploadImage(request.files.find(img => img.fieldname === "companyauthorityimage")),
                companypanimage: await uploadImage(request.files.find(img => img.fieldname === "companypanimage")),
                companytanimage: await uploadImage(request.files.find(img => img.fieldname === "companytanimage")),
                companytinimage: await uploadImage(request.files.find(img => img.fieldname === "companytinimage")),
                companygstimage: await uploadImage(request.files.find(img => img.fieldname === "companygstimage")),
                companyregistration, companyregistrationdetails, companyregistrationremark, companycin, companycindetails, companycinremark, companyissuedplace, companyissuedplacedetails, companyissuedplaceremark, companyauthority, companyauthoritydetails, companyauthorityremark, companyregistrationdate, companypan, companypandetails, companypanremark, companytan, companytandetails, companytanremark, companytin, companytindetails, companytinremark, companygst, companygstdetails, companygstremark,
                RegistrationB1: dataB1,
                RegistrationB2: dataB2,
                RegistrationB3: dataB3,
            }
        }
        if (clientDataC1 && clientDataC2 && clientDataC3 && clientDataC4) {
            company = {
                // // C Starts
                ClientcontactC1: clientDataC1,
                ClientcontactC2: clientDataC2,
                ClientcontactC3: clientDataC3,
                ClientcontactC4: clientDataC4,
            }
        }
        if (pfnumber && doc && pfaddress && pfstate && pfdistrict && pfpin && esinumber && esidoc && esiaddress && esistate && esidistrict && esipin && registrationD3 && doregistrationD3 && doeregistrationD3 && doddrregistrationD3 && managernameD3 && noeD3 && noemD3 && noefD3 && issueauthfD3 && fpD3 && doapp && issueauthfpD3 && powerfpD3 && powerhpfpD3 && registrationlwfD3 && doregistrationlwfD3 && registrationptrD3 && doregistrationptrD3) {
            company = {
                // // D Starts
                pfimage: await uploadImage(request.files.find(img => img.fieldname === "pfimage")),
                pfaddressimage: await uploadImage(request.files.find(img => img.fieldname === "pfaddressimage")),
                esiimage: await uploadImage(request.files.find(img => img.fieldname === "esiimage")),
                esiaddressimage: await uploadImage(request.files.find(img => img.fieldname === "esiaddressimage")),
                registrationD3image: await uploadImage(request.files.find(img => img.fieldname === "registrationD3image")),
                managernameD3image: await uploadImage(request.files.find(img => img.fieldname === "managernameD3image")),
                issueauthfD3image: await uploadImage(request.files.find(img => img.fieldname === "issueauthfD3image")),
                fpD3image: await uploadImage(request.files.find(img => img.fieldname === "fpD3image")),
                issueauthfpD3image: await uploadImage(request.files.find(img => img.fieldname === "issueauthfpD3image")),
                powerfpD3image: await uploadImage(request.files.find(img => img.fieldname === "powerfpD3image")),
                powerhpfpD3image: await uploadImage(request.files.find(img => img.fieldname === "powerhpfpD3image")),
                registrationlwfD3image: await uploadImage(request.files.find(img => img.fieldname === "registrationlwfD3image")),
                registrationptrD3image: await uploadImage(request.files.find(img => img.fieldname === "registrationptrD3image")),
                pfnumber, pfdetails, pfdremark, doc, pfaddress, pfstate, pfdistrict, pfpin, pfaddressdetails, esinumber, esidetails, esidremark, esidoc, esiaddress, esistate, esidistrict, esipin, esiaddressdetails, esiaddressremark, registrationD3, registrationD3details, registrationD3remark, doregistrationD3, doeregistrationD3, doddrregistrationD3, managernameD3, managernameD3details, managernameD3remark, noeD3, noemD3, noefD3, issueauthfD3, issueauthfD3details, issueauthfD3remark, fpD3, fpD3details, fpD3remark, doapp, issueauthfpD3, issueauthfpD3details, issueauthfpD3remark, powerfpD3, powerfpD3details, powerfpD3remark, powerhpfpD3, powerhpfpD3details, powerhpfpD3remark, registrationlwfD3, registrationlwfD3details, registrationlwfD3remark, doregistrationlwfD3, registrationptrD3, registrationptrD3details, registrationptrD3remark, doregistrationptrD3,
                OtherRegsitrationD1PFsubcodes: dataPFsubcodes,
                OtherRegsitrationD1ESIsubcodes: dataESIsubcodes,
                OtherRegsitrationD3NSP: dataNSP,
                OtherRegsitrationD3OTP: dataOTP,
                OtherRegsitrationD3WOE: dataWOE,
                OtherRegsitrationD3TD: dataTD,
                OtherRegsitrationD3MSME: dataMSME,
                OtherRegsitrationD3BOCW: dataBOCW,
                OtherRegsitrationD3IMW: dataIMW,
                OtherRegsitrationD3FL: dataFL,
            }
        }

        // E Starts 

        if (isEngaged && isEngagedDet && isEngagedRemark && contLabRegNoE && contLabRegNoEDet && contLabRegNoERemark && dateOfRegistrationE && dateOfRegEDet && dateOfRegERemark && noOfContractEmployeesE && noOfContractEmpEDet && noOfContractEmpERemark && noOfContractorsE && noOfContractorsEDet && noOfContractorsERemark && nameOfContractorE1 && nameOfContractorsE1Det && nameOfContractorsE1Remark && nameOfEstablishmentE1 && nameOfEstablishmentE1Det && nameOfEstablishmentE1Remark && regAddContractorE1 && regAddContractorE1Det && regAddContractorE1Remark && agreementExpiryDateE2 && agreementExpiryDateE2Det && agreementExpiryDateE2Remark && agreementRenewalDateE2 && agreementRenewalDateE2Det && agreementRenewalDateE2Remark && natureOfWorkAgreementE2 && natureOfWorkAgreementE2Det && natureOfWorkAgreementE2Remark && noOfEmpDeployedAgreementE2 && noOfEmpDeployedAgreementE2Det && noOfEmpDeployedAgreementE2Remark && companyTypeLabourE3 && companyTypeLabourE3Det && companyTypeLabourE3Remark && contractLabourLicNoE3 && contractLabourLicNoE3Det && contractLabourLicNoE3Remark && contractLicDateE3 && contractLicDateE3Det && contractLicDateE3Remark && contractExpiryDateE3 && contractExpiryDateE3Det && contractExpiryDateE3Remark && contractRenewalDueDateE3 && contractRenewalDueDateE3Det && contractRenewalDueDateE3Remark && noOfWorkersContractE3 && noOfWorkersContractE3Det && noOfWorkersContractE3Remark && panContractorsE3 && panContractorsE3Det && panContractorsE3Remark && gstContractorsE3 && gstContractorsE3Det && gstContractorsE3Remark && pfRegContractorsE3 && pfRegContractorsE3Det && pfRegContractorsE3Remark && esicRegContractorsE3 && esicRegContractorsE3Det && esicRegContractorsE3Remark && shopsandEstContractorsE3 && shopsandEstContractorsE3Det && shopsandEstContractorsE3Remark && lwfRegContractorsE3 && lwfRegContractorsE3Det && lwfRegContractorsE3Remark && profTaxContractorsE3 && profTaxContractorsE3Det && profTaxContractorsE3Remark) {
            company = {
                isEngagedFile: await uploadImage(request.files.find(img => img.fieldname === "isEngagedFile")),
                contLabRegNoEFile: await uploadImage(request.files.find(img => img.fieldname === "contLabRegNoEFile")),
                dateOfRegEFile: await uploadImage(request.files.find(img => img.fieldname === "dateOfRegEFile")),
                noOfContractEmpEFile: await uploadImage(request.files.find(img => img.fieldname === "noOfContractEmpEFile")),
                noOfContractorsEFile: await uploadImage(request.files.find(img => img.fieldname === "noOfContractorsEFile")),
                nameOfContractorsE1File: await uploadImage(request.files.find(img => img.fieldname === "nameOfContractorsE1File")),
                nameOfEstablishmentE1File: await uploadImage(request.files.find(img => img.fieldname === "nameOfEstablishmentE1File")),
                regAddContractorE1File: await uploadImage(request.files.find(img => img.fieldname === "regAddContractorE1File")),
                agreementExpiryDateE2File: await uploadImage(request.files.find(img => img.fieldname === "agreementExpiryDateE2File")),
                agreementRenewalDateE2DetFile: await uploadImage(request.files.find(img => img.fieldname === "agreementRenewalDateE2DetFile")),
                natureOfWorkAgreementE2File: await uploadImage(request.files.find(img => img.fieldname === "natureOfWorkAgreementE2File")),
                noOfEmpDeployedAgreementE2File: await uploadImage(request.files.find(img => img.fieldname === "noOfEmpDeployedAgreementE2File")),
                companyTypeLabourE3File: await uploadImage(request.files.find(img => img.fieldname === "companyTypeLabourE3File")),
                contractLabourLicNoE3File: await uploadImage(request.files.find(img => img.fieldname === "contractLabourLicNoE3File")),
                contractLicDateE3File: await uploadImage(request.files.find(img => img.fieldname === "contractLicDateE3File")),
                contractExpiryDateE3File: await uploadImage(request.files.find(img => img.fieldname === "contractExpiryDateE3File")),
                contractRenewalDueDateE3File: await uploadImage(request.files.find(img => img.fieldname === "contractRenewalDueDateE3File")),
                noOfWorkersContractE3File: await uploadImage(request.files.find(img => img.fieldname === "noOfWorkersContractE3File")),
                panContractorsE3File: await uploadImage(request.files.find(img => img.fieldname === "panContractorsE3File")),
                gstContractorsE3File: await uploadImage(request.files.find(img => img.fieldname === "gstContractorsE3File")),
                pfRegContractorsE3File: await uploadImage(request.files.find(img => img.fieldname === "pfRegContractorsE3File")),
                esicRegContractorsE3File: await uploadImage(request.files.find(img => img.fieldname === "esicRegContractorsE3File")),
                shopsandEstContractorsE3File: await uploadImage(request.files.find(img => img.fieldname === "shopsandEstContractorsE3File")),
                lwfRegContractorsE3File: await uploadImage(request.files.find(img => img.fieldname === "lwfRegContractorsE3File")),
                profTaxContractorsE3File: await uploadImage(request.files.find(img => img.fieldname === "profTaxContractorsE3File")),
                isEngaged, isEngagedDet, isEngagedRemark, contLabRegNoE, contLabRegNoEDet, contLabRegNoERemark, dateOfRegistrationE, dateOfRegEDet, dateOfRegERemark, noOfContractEmployeesE, noOfContractEmpEDet, noOfContractEmpERemark, noOfContractorsE, noOfContractorsEDet, noOfContractorsERemark, nameOfContractorE1, nameOfContractorsE1Det, nameOfContractorsE1Remark, nameOfEstablishmentE1, nameOfEstablishmentE1Det, nameOfEstablishmentE1Remark, regAddContractorE1, regAddContractorE1Det, regAddContractorE1Remark, agreementExpiryDateE2, agreementExpiryDateE2Det, agreementExpiryDateE2Remark, agreementRenewalDateE2, agreementRenewalDateE2Det, agreementRenewalDateE2Remark, natureOfWorkAgreementE2, natureOfWorkAgreementE2Det, natureOfWorkAgreementE2Remark, noOfEmpDeployedAgreementE2, noOfEmpDeployedAgreementE2Det, noOfEmpDeployedAgreementE2Remark, companyTypeLabourE3, companyTypeLabourE3Det, companyTypeLabourE3Remark, contractLabourLicNoE3, contractLabourLicNoE3Det, contractLabourLicNoE3Remark, contractLicDateE3, contractLicDateE3Det, contractLicDateE3Remark, contractExpiryDateE3, contractExpiryDateE3Det, contractExpiryDateE3Remark, contractRenewalDueDateE3, contractRenewalDueDateE3Det, contractRenewalDueDateE3Remark, noOfWorkersContractE3, noOfWorkersContractE3Det, noOfWorkersContractE3Remark, panContractorsE3, panContractorsE3Det, panContractorsE3Remark, gstContractorsE3, gstContractorsE3Det, gstContractorsE3Remark, pfRegContractorsE3, pfRegContractorsE3Det, pfRegContractorsE3Remark, esicRegContractorsE3, esicRegContractorsE3Det, esicRegContractorsE3Remark, shopsandEstContractorsE3, shopsandEstContractorsE3Det, shopsandEstContractorsE3Remark, lwfRegContractorsE3, lwfRegContractorsE3Det, lwfRegContractorsE3Remark, profTaxContractorsE3, profTaxContractorsE3Det, profTaxContractorsE3Remark
            }
        }
        // /* F Starts * 
        if (branchaddress && branchstate && branchdistrict && branchpin && branchOpeningDateF && noOfEmpBranchF && managerNameF1 && managerMobNoF1 && managerEmailF1 && managerAadharNoF1 && managerPanF1 && shopsEstLicenseF2 && contractLabRegNoF5 && regDateContractorF5 && coOfContractEmpF5 && noOfContractorsF5 && contractorNameF51 && establishmentNameF51 && regisocontractaddress && regisocontractstate && regisocontractdistrict && regisocontractpin && expiryDateF52 && renewalDateF52 && natureOfWorkF52 && noOfEmpDeployedF52 && contractLabLicNoF53 && licenseDateF53 && expiryDateF53 && renewalDateF53 && noOfWorkerF53 && panF53 && gstF53 && pfRegF53 && esicRegF53 && shopsEstF53 && lwfRegF53 && profTaxF53) {
            
            company = {
                contractorAddBranchFFile : await uploadImage(request.files.find(img => img.fieldname === "contractorAddBranchFFile")),
                managerNameF1File : await uploadImage(request.files.find(img => img.fieldname === "managerNameF1File")),
                managerAadharNoF1File : await uploadImage(request.files.find(img => img.fieldname === "managerAadharNoF1File")),
                managerPanF1File : await uploadImage(request.files.find(img => img.fieldname === "shopsEstLicenseF2File")),
                shopsEstLicenseF2File : await uploadImage(request.files.find(img => img.fieldname === "shopsEstLicenseF2File")),
                contractLabRegNoF5File : await uploadImage(request.files.find(img => img.fieldname === "contractLabRegNoF5File")),
                contractorNameF51File : await uploadImage(request.files.find(img => img.fieldname === "contractorNameF51File")),
                establishmentNameF51File : await uploadImage(request.files.find(img => img.fieldname === "establishmentNameF51File")),
                regAddContractorF51File : await uploadImage(request.files.find(img => img.fieldname === "regAddContractorF51File")),
                natureOfWorkF52File : await uploadImage(request.files.find(img => img.fieldname === "natureOfWorkF52File")),
                companyTypeF53File : await uploadImage(request.files.find(img => img.fieldname === "companyTypeF53File")),
                contractLabLicNoF53File : await uploadImage(request.files.find(img => img.fieldname === "contractLabLicNoF53File")),
                panF53File : await uploadImage(request.files.find(img => img.fieldname === "panF53File")),
                gstF53File : await uploadImage(request.files.find(img => img.fieldname === "gstF53File")),
                pfRegF53File : await uploadImage(request.files.find(img => img.fieldname === "pfRegF53File")),
                esicRegF53File : await uploadImage(request.files.find(img => img.fieldname === "esicRegF53File")),
                shopsEstF53File : await uploadImage(request.files.find(img => img.fieldname === "shopsEstF53File")),
                lwfRegF53File : await uploadImage(request.files.find(img => img.fieldname === "lwfRegF53File")),
                profTaxF53File : await uploadImage(request.files.find(img => img.fieldname === "profTaxF53File")),
                branchaddress, branchstate, branchdistrict, branchpin, contractorAddBranchFDet, contractorAddBranchFRemark, branchOpeningDateF, noOfEmpBranchF, managerNameF1, managerNameF1Det, managerNameF1Remark, managerMobNoF1, managerMobNoF1Det, managerMobNoF1Remark, managerEmailF1, managerEmailF1Det, managerEmailF1Remark, managerAadharNoF1, managerAadharNoF1Det, managerAadharNoF1Remark, managerPanF1, managerPanF1Det, managerPanF1Remark, shopsEstLicenseF2, shopsEstLicenseF2Det, shopsEstLicenseF2Remark, contractLabRegNoF5, contractLabRegNoF5Det, contractLabRegNoF5Remark, regDateContractorF5, coOfContractEmpF5, noOfContractorsF5, contractorNameF51, contractorNameF51Det, contractorNameF51Remark, establishmentNameF51, establishmentNameF51Det, establishmentNameF51Remark, regisocontractaddress, regisocontractstate, regisocontractdistrict, regisocontractpin, regAddContractorF51Det, regAddContractorF51Remark, expiryDateF52, renewalDateF52, natureOfWorkF52, natureOfWorkF52Det, natureOfWorkF52Remark, noOfEmpDeployedF52, companyTypeF53Det, companyTypeF53Remark, contractLabLicNoF53, contractLabLicNoF53Det, contractLabLicNoF53Remark, licenseDateF53, expiryDateF53, renewalDateF53, noOfWorkerF53, panF53, panF53Det, panF53Remark, gstF53, gstF53Det, gstF53Remark, pfRegF53, pfRegF53Det, pfRegF53Remark, esicRegF53, esicRegF53Det, esicRegF53Remark, shopsEstF53, shopsEstF53Det, shopsEstF53Remark, lwfRegF53, lwfRegF53Det, lwfRegF53Remark, profTaxF53, profTaxF53Det, profTaxF53Remark,
                F1branch : dataF1branch, 
                F1RLicense : dataF1RLicense, 
                F1FL : dataF1FL, 
                F1FP : dataF1FP, 
                F54NSP : dataF54NSP, 
                F54OTP : dataF54OTP, 
                F54WOE : dataF54WOE, 
                F54TL : dataF54TL

            }
        } 
        // G Starts
        if(isLabourEngagedG && noOfClientG && clientG && regOfficeAddClientG && pincode && noOfLocContractWorkG11 && regAddOfClientG11 && pincode && agreementRefNoG12 && agreementDateG12 && agreementValidityG12 && noOfWorkersEngagedG12 && estCategoryG12 && isClraApplicableG12 && noOfForm5G13 && form5DateG13 && workCommencedDateG13 && clraLicenseNoG13 && clraLicenseDateG13 && clraValidityG13 && clraRenewalDueG13 && clraNoOfContWorkersG13 && clraNoOfManagerRespG13 && clraLicenseFeeG13 && securityDepositG13 && contWorkCompletedDate && contWorkComplitionNotice && refundSecDepNotice && licSurrenderedDate&&regOfficeAddClientG&& regOfficeStateClientG&& regOfficeDistClientG&& regOfficePinClientG&& regAddOfClientG11&& regStateOfClientG11&& regDistOfClientG11&& regPinOfClientG11 ){
            company = {
                isLabourEngagedGFile : await uploadImage(request.files.find(img => img.fieldname === "isLabourEngagedGFile")),
noOfClientGFile : await uploadImage(request.files.find(img => img.fieldname === "noOfClientGFile")),
clientGFile : await uploadImage(request.files.find(img => img.fieldname === "clientGFile")),
regOfficeAddClientGFile : await uploadImage(request.files.find(img => img.fieldname === "regOfficeAddClientGFile")),
noOfLocContractWorkG11File : await uploadImage(request.files.find(img => img.fieldname === "noOfLocContractWorkG11File")),
regAddOfClientG11File : await uploadImage(request.files.find(img => img.fieldname === "regAddOfClientG11File")),
agreementRefNoG12File : await uploadImage(request.files.find(img => img.fieldname === "agreementRefNoG12File")),
agreementDateG12File : await uploadImage(request.files.find(img => img.fieldname === "agreementDateG12File")),
agreementValidityG12File : await uploadImage(request.files.find(img => img.fieldname === "agreementValidityG12File")),
noOfWorkersEngagedG12File : await uploadImage(request.files.find(img => img.fieldname === "noOfWorkersEngagedG12File")),
estCategoryG12File : await uploadImage(request.files.find(img => img.fieldname === "estCategoryG12File")),
noOfForm5G13File : await uploadImage(request.files.find(img => img.fieldname === "noOfForm5G13File")),
form5DateG13File : await uploadImage(request.files.find(img => img.fieldname === "form5DateG13File")),
workCommencedDateG13File : await uploadImage(request.files.find(img => img.fieldname === "workCommencedDateG13File")),
clraLicenseNoG13File : await uploadImage(request.files.find(img => img.fieldname === "clraLicenseNoG13File")),
clraLicenseDateG13File : await uploadImage(request.files.find(img => img.fieldname === "clraLicenseDateG13File")),
clraValidityG13File : await uploadImage(request.files.find(img => img.fieldname === "clraValidityG13File")),
clraRenewalDueG13File : await uploadImage(request.files.find(img => img.fieldname === "clraRenewalDueG13File")),
clraNoOfContWorkersG13File : await uploadImage(request.files.find(img => img.fieldname === "clraNoOfContWorkersG13File")),
clraNoOfManagerRespG13File : await uploadImage(request.files.find(img => img.fieldname === "clraNoOfManagerRespG13File")),
clraLicenseFeeG13File : await uploadImage(request.files.find(img => img.fieldname === "clraLicenseFeeG13File")),
securityDepositG13File : await uploadImage(request.files.find(img => img.fieldname === "securityDepositG13File")),
contWorkCompletedDateFile : await uploadImage(request.files.find(img => img.fieldname === "contWorkCompletedDateFile")),
contWorkComplitionNoticeFile : await uploadImage(request.files.find(img => img.fieldname === "contWorkComplitionNoticeFile")),
refundSecDepNoticeFile : await uploadImage(request.files.find(img => img.fieldname === "refundSecDepNoticeFile")),
licSurrenderedDateFile : await uploadImage(request.files.find(img => img.fieldname === "licSurrenderedDateFile")),
                isLabourEngagedG, isLabourEngagedGDet, isLabourEngagedGRemark, noOfClientG, noOfClientGDet, noOfClientGRemark, clientG, clientGDet, clientGRemark, regOfficeAddClientG, regOfficeStateClientG, regOfficeDistClientG, regOfficePinClientG, regOfficeAddClientGDet, regOfficeAddClientGRemark, noOfLocContractWorkG11, noOfLocContractWorkG11Det, noOfLocContractWorkG11Remark, regAddOfClientG11, regStateOfClientG11, regDistOfClientG11, regPinOfClientG11, regAddOfClientG11Det, regAddOfClientG11Remark, agreementRefNoG12, agreementRefNoG12Det, agreementRefNoG12Remark, agreementDateG12, agreementDateG12Det, agreementDateG12Remark, agreementValidityG12, agreementValidityG12Det, agreementValidityG12Remark, noOfWorkersEngagedG12, noOfWorkersEngagedG12Det, noOfWorkersEngagedG12Remark, estCategoryG12, estCategoryG12Det, estCategoryG12Remark, isClraApplicableG12, noOfForm5G13, noOfForm5G13Det, noOfForm5G13Remark, form5DateG13, form5DateG13Det, form5DateG13Remark, workCommencedDateG13, workCommencedDateG13Det, workCommencedDateG13Remark, clraLicenseNoG13, clraLicenseNoG13Det, clraLicenseNoG13Remark, clraLicenseDateG13, clraLicenseDateG13Det, clraLicenseDateG13Remark, clraValidityG13, clraValidityG13Det, clraValidityG13Remark, clraRenewalDueG13, clraRenewalDueG13Det, clraRenewalDueG13Remark, clraNoOfContWorkersG13, clraNoOfContWorkersG13Det, clraNoOfContWorkersG13Remark, clraNoOfManagerRespG13, clraNoOfManagerRespG13Det, clraNoOfManagerRespG13Remark, clraLicenseFeeG13, clraLicenseFeeG13Det, clraLicenseFeeG13Remark, securityDepositG13, securityDepositG13Det, securityDepositG13Remark, contWorkCompletedDate, contWorkCompletedDateDet, contWorkCompletedDateRemark, contWorkComplitionNotice, contWorkComplitionNoticeDet, contWorkComplitionNoticeRemark, refundSecDepNotice, refundSecDepNoticeDet, refundSecDepNoticeRemark, licSurrenderedDate, licSurrenderedDateDet, licSurrenderedDateRemark
            }
        }   
        newCompany = await Companydata.findOneAndUpdate({ _id: lastInsertedIdcompany }, company, { new: true })
        response.status(201).json(newCompany);
    
}
    catch (error) {
        next(error);
    }
}

    
    /** pradeep code ends*/




    // ------------------------------- Rough Space -----------------------------



    // export const createCompanyClientContact = async (request, response, next) => {
    //     try {
    //         const data = request.body
    //         const { ClientcontactC1, ClientcontactC2, ClientcontactC3, ClientcontactC4 } = data
    //         const uploadImage = async (imageFile) => {
    //             if (!imageFile) {
    //                 return null;
    //             }
    //             const url = request.protocol + "://" + request.get('host');
    //             const uploadsDirectory = './data/uploads/';
    //             const imageDirectory = 'images/';
    //             const formattedImageFileName = Date.now() + '-' + imageFile.originalname.split(' ').join('-');
    //             const imageUrl = url + '/' + imageDirectory + formattedImageFileName
    //             const imagePath = uploadsDirectory + imageDirectory + formattedImageFileName;
    //             await sharp(imageFile.buffer).resize({ width: 600 }).toFile(imagePath);
    //             return imageUrl
    //         }
    //         let clientDataC1, clientDataC2, clientDataC3, clientDataC4
    //         if (ClientcontactC1 !== undefined && ClientcontactC1.length > 0) {
    //             clientDataC1 = await Promise.all(ClientcontactC1.map(async (item, index) => {
    //                 return {
    //                     ...item,
    //                     nameimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC1[${index}][nameimage]`)),
    //                     designationimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC1[${index}][designationimage]`))
    //                 }
    //             }))
    //         }
    //         if (ClientcontactC2 !== undefined && ClientcontactC2.length > 0) {
    //             clientDataC2 = await Promise.all(ClientcontactC2.map(async (item, index) => {
    //                 return {
    //                     ...item,
    //                     nameimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC2[${index}][nameimage]`)),
    //                     designationimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC2[${index}][designationimage]`))
    //                 }
    //             }))
    //         }
    //         if (ClientcontactC3 !== undefined && ClientcontactC3.length > 0) {
    //             clientDataC3 = await Promise.all(ClientcontactC3.map(async (item, index) => {
    //                 return {
    //                     ...item,
    //                     nameimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC3[${index}][nameimage]`)),
    //                     designationimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC3[${index}][designationimage]`))
    //                 }
    //             }))
    //         }
    //         if (ClientcontactC4 !== undefined && ClientcontactC4.length > 0) {
    //             clientDataC4 = await Promise.all(ClientcontactC4.map(async (item, index) => {
    //                 return {
    //                     ...item,
    //                     nameimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC4[${index}][nameimage]`)),
    //                     designationimage: await uploadImage(request.files.find(img => img.fieldname === `ClientcontactC4[${index}][designationimage]`))
    //                 }
    //             }))
    //         }

    //         const clientContact = {
    //             ClientcontactC1: clientDataC1, ClientcontactC2: clientDataC2, ClientcontactC3: clientDataC3, ClientcontactC4: clientDataC4, created_at, updated_at
    //         }
    //         const newClientContact = new ClientContact(clientContact)
    //         await newClientContact.save()
    //         response.status(201).json(newClientContact)
    //     } catch (error) {
    //         next(error)
    //     }
    // }

    // export const createOtherRegistration = async (request, response, next) => {
    //     try {
    //         const data = request.body
    //         const { pfnumber, pfdetails, pfdremark, doc, pfaddress, pfstate, pfdistrict, pfpin, pfaddressdetails, OtherRegsitrationD1PFsubcodes, OtherRegsitrationD1ESIsubcodes, OtherRegsitrationD3NSP, OtherRegsitrationD3FL, OtherRegsitrationD3OTP, OtherRegsitrationD3WOE, OtherRegsitrationD3TD, OtherRegsitrationD3MSME, OtherRegsitrationD3BOCW, OtherRegsitrationD3IMW, esinumber, esidetails, esidremark, esidoc, esiaddress, esistate, esidistrict, esipin, esiaddressdetails, esiaddressremark, registrationD3, registrationD3details, registrationD3remark, doregistrationD3, doeregistrationD3, doddrregistrationD3, managernameD3, managernameD3details, managernameD3remark, noeD3, noemD3, noefD3, issueauthfD3, issueauthfD3details, issueauthfD3remark, fpD3, fpD3details, fpD3remark, doapp, issueauthfpD3, issueauthfpD3details, issueauthfpD3remark, powerfpD3, powerfpD3details, powerfpD3remark, powerhpfpD3, powerhpfpD3details, powerhpfpD3remark, registrationlwfD3, registrationlwfD3details, registrationlwfD3remark, doregistrationlwfD3, registrationptrD3, registrationptrD3details, registrationptrD3remark, doregistrationptrD3,
    //         } = data

    //         const uploadImage = async (imageFile) => {
    //             if (!imageFile) {
    //                 return null; // Return null if image is not provided
    //             }
    //             const url = request.protocol + '://' + request.get('host');
    //             const uploadsDirectory = './data/uploads/';
    //             const imageDirectory = 'images/';
    //             const formattedImageFileName = Date.now() + '-' + imageFile.originalname.split(' ').join('-');
    //             const imageUrl = url + '/' + imageDirectory + formattedImageFileName;
    //             // console.log(imageUrl);
    //             const imagePath = uploadsDirectory + imageDirectory + formattedImageFileName;
    //             await sharp(imageFile.buffer).resize({ width: 600 }).toFile(imagePath);
    //             return imageUrl;
    //         };
    //         let dataPFsubcodes, dataESIsubcodes, dataFL, dataNSP, dataOTP, dataWOE, dataTD, dataMSME, dataIMW, dataBOCW
    //         if (OtherRegsitrationD1PFsubcodes !== undefined && OtherRegsitrationD1PFsubcodes.length > 0) {
    //             dataPFsubcodes = await Promise.all(OtherRegsitrationD1PFsubcodes.map(async (item, index) => {
    //                 return {
    //                     ...item,
    //                     regimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1PFsubcodes[${index}][regimage]`)),
    //                     docimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1PFsubcodes[${index}][docimage]`)),
    //                     offaddressimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1PFsubcodes[${index}][offaddressimage]`))
    //                 }
    //             }))
    //         }
    //         if (OtherRegsitrationD1ESIsubcodes !== undefined && OtherRegsitrationD1ESIsubcodes.length > 0) {
    //             dataESIsubcodes = await Promise.all(OtherRegsitrationD1ESIsubcodes.map(async (item, index) => {
    //                 return {
    //                     ...item,
    //                     esiimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1ESIsubcodes[${index}][esiimage]`)),
    //                     esidocimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1ESIsubcodes[${index}][esidocimage]`)),
    //                     esioffaddressimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD1ESIsubcodes[${index}][esioffaddressimage]`))
    //                 }
    //             }))
    //         }
    //         if (OtherRegsitrationD3FL !== undefined && OtherRegsitrationD3FL.length > 0) {
    //             dataFL = await Promise.all(OtherRegsitrationD3FL.map(async (item, index) => {
    //                 return {
    //                     ...item,
    //                     managerlicenseimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3FL[${index}][managerlicenseimage]`)),
    //                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3FL[${index}][issuingauthimage]`)),
    //                 }
    //             }))
    //         }
    //         if (OtherRegsitrationD3NSP !== undefined && OtherRegsitrationD3NSP.length > 0) {
    //             dataNSP = await Promise.all(OtherRegsitrationD3NSP.map(async (item, index) => {
    //                 return {
    //                     ...item,
    //                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3NSP[${index}][issuingauthimage]`)),
    //                 }
    //             }))
    //         }
    //         if (OtherRegsitrationD3OTP !== undefined && OtherRegsitrationD3OTP.length > 0) {
    //             dataOTP = await Promise.all(OtherRegsitrationD3OTP.map(async (item, index) => {
    //                 return {
    //                     ...item,
    //                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3OTP[${index}][issuingauthimage]`)),
    //                 }
    //             }))
    //         }
    //         if (OtherRegsitrationD3WOE !== undefined && OtherRegsitrationD3WOE.length > 0) {
    //             dataWOE = await Promise.all(OtherRegsitrationD3WOE.map(async (item, index) => {
    //                 return {
    //                     ...item,
    //                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3WOE[${index}][issuingauthimage]`)),
    //                 }
    //             }))
    //         }
    //         if (OtherRegsitrationD3TD !== undefined && OtherRegsitrationD3TD.length > 0) {
    //             dataTD = await Promise.all(OtherRegsitrationD3TD.map(async (item, index) => {
    //                 return {
    //                     ...item,
    //                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3TD[${index}][issuingauthimage]`)),
    //                 }
    //             }))
    //         }
    //         if (OtherRegsitrationD3MSME !== undefined && OtherRegsitrationD3MSME.length > 0) {
    //             dataMSME = await Promise.all(OtherRegsitrationD3MSME.map(async (item, index) => {
    //                 return {
    //                     ...item,
    //                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3MSME[${index}][issuingauthimage]`)),
    //                 }
    //             }))
    //         }
    //         if (OtherRegsitrationD3BOCW !== undefined && OtherRegsitrationD3BOCW.length > 0) {
    //             dataBOCW = await Promise.all(OtherRegsitrationD3BOCW.map(async (item, index) => {
    //                 return {
    //                     ...item,
    //                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3BOCW[${index}][issuingauthimage]`)),
    //                 }
    //             }))
    //         }
    //         if (OtherRegsitrationD3IMW !== undefined && OtherRegsitrationD3IMW.length > 0) {
    //             dataIMW = await Promise.all(OtherRegsitrationD3IMW.map(async (item, index) => {
    //                 return {
    //                     ...item,
    //                     issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `OtherRegsitrationD3IMW[${index}][issuingauthimage]`)),
    //                 }
    //             }))
    //         }

    //         const otherRegistration = {
    //             pfnumber, pfdetails, pfimage: await uploadImage(request.files.find(img => img.fieldname === "pfimage")), pfdremark, doc, pfaddress, pfstate, pfdistrict, pfpin, pfaddressdetails, pfaddressimage: await uploadImage(request.files.find(img => img.fieldname === "pfaddressimage")), esinumber, esidetails, esiimage: await uploadImage(request.files.find(img => img.fieldname === "esiimage")), esidremark, esidoc, esiaddress, esistate, esidistrict, esipin, esiaddressdetails, esiaddressimage: await uploadImage(request.files.find(img => img.fieldname === "esiaddressimage")), esiaddressremark, registrationD3, registrationD3details, registrationD3image: await uploadImage(request.files.find(img => img.fieldname === "registrationD3image")), registrationD3remark, doregistrationD3, doeregistrationD3, doddrregistrationD3, managernameD3, managernameD3details, managernameD3image: await uploadImage(request.files.find(img => img.fieldname === "managernameD3image")), managernameD3remark, noeD3, noemD3, noefD3, issueauthfD3, issueauthfD3details, issueauthfD3image: await uploadImage(request.files.find(img => img.fieldname === "issueauthfD3image")), issueauthfD3remark, fpD3, fpD3details, fpD3image: await uploadImage(request.files.find(img => img.fieldname === "fpD3image")), fpD3remark, doapp, issueauthfpD3, issueauthfpD3details, issueauthfpD3image: await uploadImage(request.files.find(img => img.fieldname === "issueauthfpD3image")), issueauthfpD3remark, powerfpD3, powerfpD3details, powerfpD3image: await uploadImage(request.files.find(img => img.fieldname === "powerfpD3image")), powerfpD3remark, powerhpfpD3, powerhpfpD3details, powerhpfpD3image: await uploadImage(request.files.find(img => img.fieldname === "powerhpfpD3image")), powerhpfpD3remark, registrationlwfD3, registrationlwfD3details, registrationlwfD3image: await uploadImage(request.files.find(img => img.fieldname === "registrationlwfD3image")), registrationlwfD3remark, doregistrationlwfD3, registrationptrD3, registrationptrD3details, registrationptrD3image: await uploadImage(request.files.find(img => img.fieldname === "registrationptrD3image")), registrationptrD3remark, doregistrationptrD3,
    //             OtherRegsitrationD1PFsubcodes: dataPFsubcodes,
    //             OtherRegsitrationD1ESIsubcodes: dataESIsubcodes,
    //             OtherRegsitrationD3NSP: dataNSP,
    //             OtherRegsitrationD3OTP: dataOTP,
    //             OtherRegsitrationD3WOE: dataWOE,
    //             OtherRegsitrationD3TD: dataTD,
    //             OtherRegsitrationD3MSME: dataMSME,
    //             OtherRegsitrationD3BOCW: dataBOCW,
    //             OtherRegsitrationD3IMW: dataIMW,
    //             OtherRegsitrationD3FL: dataFL,
    //         }
    //     }
    //     catch (error) {
    //         next(error)
    //     }
    // }

    // f new

//  branchaddress, branchstate, branchdistrict, branchpin, contractorAddBranchFDet, contractorAddBranchFRemark, branchOpeningDateF, noOfEmpBranchF, managerNameF1, managerNameF1Det, managerNameF1Remark, managerMobNoF1, managerMobNoF1Det, managerMobNoF1Remark, managerEmailF1, managerEmailF1Det, managerEmailF1Remark, managerAadharNoF1, managerAadharNoF1Det, managerAadharNoF1Remark, managerPanF1, managerPanF1Det, managerPanF1Remark, shopsEstLicenseF2, shopsEstLicenseF2Det, shopsEstLicenseF2Remark, contractLabRegNoF5, contractLabRegNoF5Det, contractLabRegNoF5Remark, regDateContractorF5, coOfContractEmpF5, noOfContractorsF5, contractorNameF51, contractorNameF51Det, contractorNameF51Remark, establishmentNameF51, establishmentNameF51Det, establishmentNameF51Remark, regisocontractaddress, regisocontractstate, regisocontractdistrict, regisocontractpin, regAddContractorF51Det, regAddContractorF51Remark, expiryDateF52, renewalDateF52, natureOfWorkF52, natureOfWorkF52Det, natureOfWorkF52Remark, noOfEmpDeployedF52, companyTypeF53Det, companyTypeF53Remark, contractLabLicNoF53, contractLabLicNoF53Det, contractLabLicNoF53Remark, licenseDateF53, expiryDateF53, renewalDateF53, noOfWorkerF53, panF53, panF53Det, panF53Remark, gstF53, gstF53Det, gstF53Remark, pfRegF53, pfRegF53Det, pfRegF53Remark, esicRegF53, esicRegF53Det, esicRegF53Remark, shopsEstF53, shopsEstF53Det, shopsEstF53Remark, lwfRegF53, lwfRegF53Det, lwfRegF53Remark, profTaxF53, profTaxF53Det, profTaxF53Remark,
// branchaddress : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// branchstate : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// branchdistrict : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// branchpin : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// contractorAddBranchFDet : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// contractorAddBranchFRemark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// branchOpeningDateF : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// noOfEmpBranchF : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// managerNameF1 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// managerNameF1Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// managerNameF1Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// managerMobNoF1 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// managerMobNoF1Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// managerMobNoF1Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// managerEmailF1 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// managerEmailF1Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// managerEmailF1Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// managerAadharNoF1 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// managerAadharNoF1Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// managerAadharNoF1Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// managerPanF1 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// managerPanF1Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// managerPanF1Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// shopsEstLicenseF2 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// shopsEstLicenseF2Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// shopsEstLicenseF2Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// contractLabRegNoF5 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// contractLabRegNoF5Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// contractLabRegNoF5Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// regDateContractorF5 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// coOfContractEmpF5 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// noOfContractorsF5 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// contractorNameF51 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// contractorNameF51Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// contractorNameF51Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// establishmentNameF51 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// establishmentNameF51Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// establishmentNameF51Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// regisocontractaddress : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// regisocontractstate : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// regisocontractdistrict : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// regisocontractpin : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// regAddContractorF51Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// regAddContractorF51Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// expiryDateF52 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// renewalDateF52 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// natureOfWorkF52 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// natureOfWorkF52Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// natureOfWorkF52Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// noOfEmpDeployedF52 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// companyTypeF53Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// companyTypeF53Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// contractLabLicNoF53 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// contractLabLicNoF53Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// contractLabLicNoF53Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// licenseDateF53 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// expiryDateF53 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// renewalDateF53 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// noOfWorkerF53 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// panF53 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// panF53Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// panF53Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// gstF53 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// gstF53Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// gstF53Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// pfRegF53 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// pfRegF53Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// pfRegF53Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// esicRegF53 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// esicRegF53Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// esicRegF53Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// shopsEstF53 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// shopsEstF53Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// shopsEstF53Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// lwfRegF53 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// lwfRegF53Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// lwfRegF53Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// profTaxF53 : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// profTaxF53Det : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }
// profTaxF53Remark : {
//     type : String,
//     default : null,
//     trim : true,
//     index : true
// }

// F1branch[0][name]: Prayagraj
// F1branch[0][details]: sdsds
// F1branch[0][remarks]: sdsddsd
// F1branch[1][name]: NOIDA
// F1branch[1][details]: dsd
// F1branch[1][remarks]: sdsds
// F1RLicense[0][dor]: 2024-03-12
// F1RLicense[0][doe]: 2024-03-12
// F1RLicense[0][doddr]: 2024-03-12
// F1RLicense[0][managernamelicense]: asasa
// F1RLicense[0][managerlicensedetails]: asasa
// F1RLicense[0][managerlicenseremark]: dsdssds
// F1RLicense[0][noe]: 1
// F1RLicense[0][nom]: 1
// F1RLicense[0][nof]: 0
// F1RLicense[0][issuingauth]: asasasa
// F1RLicense[0][issuingauthdetails]: sasas
// F1RLicense[0][issuingauthremark]: asas
// F1FL[0][dor]: 2024-03-12
// F1FL[0][doe]: 2024-03-12
// F1FL[0][doddr]: 2024-03-12
// F1FL[0][managernamelicense]: asas
// F1FL[0][managerlicensedetails]: asasa
// F1FL[0][managerlicenseremark]: dsdsd
// F1FL[0][noe]: 1
// F1FL[0][nom]: 1
// F1FL[0][nof]: 0
// F1FL[0][issuingauth]: asasa
// F1FL[0][issuingauthdetails]: asasa
// F1FL[0][issuingauthremark]: asasa
// F1FP[0][dor]: 2024-03-12
// F1FP[0][issuingauth]: asasas
// F1FP[0][issuingauthdetails]: asasas
// F1FP[0][issuingauthremark]: asasas
// F54NSP[0][dor]: 2024-03-12
// F54NSP[0][doe]: 2024-03-12
// F54NSP[0][doddr]: 2024-03-12
// F54NSP[0][issuingauth]: asasa
// F54NSP[0][issuingauthdetails]: asas
// F54NSP[0][issuingauthremark]: saasa
// F54OTP[0][dor]: 2024-03-12
// F54OTP[0][doe]: 2024-03-12
// F54OTP[0][doddr]: 2024-03-12
// F54OTP[0][issuingauth]: asa
// F54OTP[0][issuingauthdetails]: ass
// F54OTP[0][issuingauthremark]: asas
// F54WOE[0][dor]: 2024-03-12
// F54WOE[0][doe]: 2024-03-12
// F54WOE[0][doddr]: 2024-03-12
// F54WOE[0][issuingauth]: sasa
// F54WOE[0][issuingauthdetails]: asasas
// F54WOE[0][issuingauthremark]: 
// F54TL[0][dor]: 2024-03-12
// F54TL[0][doe]: 2024-03-12
// F54TL[0][doddr]: 2024-03-13
// F54TL[0][issuingauth]: sdsds
// F54TL[0][issuingauthdetails]: sdsd
// F54TL[0][issuingauthremark]: sdsds



// branchaddress,
// branchstate,
// branchdistrict,
// branchpin,
// branchOpeningDateF,
// noOfEmpBranchF,
// managerNameF1,
// managerMobNoF1,
// managerEmailF1,
// managerAadharNoF1,
// managerPanF1,
// shopsEstLicenseF2,
// contractLabRegNoF5,
// regDateContractorF5,
// coOfContractEmpF5,
// noOfContractorsF5,
// contractorNameF51,
// establishmentNameF51,
// regisocontractaddress,
// regisocontractstate,
// regisocontractdistrict,
// regisocontractpin,
// expiryDateF52,
// renewalDateF52,
// natureOfWorkF52,
// noOfEmpDeployedF52,
// renewalDateF52,
// contractLabLicNoF53,
// licenseDateF53,
// expiryDateF53,
// renewalDateF53,
// noOfWorkerF53,
// panF53,
// gstF53,
// pfRegF53,
// esicRegF53,
// shopsEstF53,
// lwfRegF53,
// profTaxF53,

// F new file

// contractorAddBranchFFile : {
//     type : Object,
//     default : null
// }
// managerNameF1File : {
//     type : Object,
//     default : null
// }
// managerAadharNoF1File : {
//     type : Object,
//     default : null
// }
// managerPanF1File : {
//     type : Object,
//     default : null
// }
// shopsEstLicenseF2File : {
//     type : Object,
//     default : null
// }
// contractLabRegNoF5File : {
//     type : Object,
//     default : null
// }
// contractorNameF51File : {
//     type : Object,
//     default : null
// }
// establishmentNameF51File : {
//     type : Object,
//     default : null
// }
// regAddContractorF51File : {
//     type : Object,
//     default : null
// }
// natureOfWorkF52File : {
//     type : Object,
//     default : null
// }
// companyTypeF53File : {
//     type : Object,
//     default : null
// }
// contractLabLicNoF53File : {
//     type : Object,
//     default : null
// }
// panF53File : {
//     type : Object,
//     default : null
// }
// gstF53File : {
//     type : Object,
//     default : null
// }
// pfRegF53File : {
//     type : Object,
//     default : null
// }
// esicRegF53File : {
//     type : Object,
//     default : null
// }
// shopsEstF53File : {
//     type : Object,
//     default : null
// }
// lwfRegF53File : {
//     type : Object,
//     default : null
// }
// profTaxF53File : {
//     type : Object,
//     default : null
// }









    // E File

    // isEngagedFile && contLabRegNoEFile && dateOfRegEFile && noOfContractEmpEFile && noOfContractorsEFile && nameOfContractorsE1File && nameOfEstablishmentE1File && regAddContractorE1File && agreementExpiryDateE2File && agreementRenewalDateE2DetFile && natureOfWorkAgreementE2File && noOfEmpDeployedAgreementE2File && companyTypeLabourE3File && contractLabourLicNoE3File && contractLicDateE3File && contractExpiryDateE3File && contractRenewalDueDateE3File && noOfWorkersContractE3File && panContractorsE3File && gstContractorsE3File && pfRegContractorsE3File && esicRegContractorsE3File && shopsandEstContractorsE3File && lwfRegContractorsE3File && profTaxContractorsE3File &&
    // F Data 

    // managerNameF1 && managerNameF1Det && managerNameF1Remark && managerMobNoF1 && managerMobNoF1Det && managerMobNoF1Remark && managerEmailF1 && managerEmailF1Det && managerEmailF1Remark && managerAadharNoF1 && managerAadharNoF1Det && managerAadharNoF1Remark && managerPanF1 && managerPanF1Det && managerPanF1Remark && shopsEstLicenseF2 && shopsEstLicenseF2Det && shopsEstLicenseF2Remark && numberF2 && numberF2Det && numberF2Remark && regDateF2 && regDateF2Det && regDateF2Remark && expiryDateF2 && expiryDateF2Det && expiryDateF2Remark && renewalDateF2 && renewalDateF2Det && renewalDateF2Remark && managerNameF2 && managerNameF2Det && managerNameF2Remark && noOfEmployeesF2 && noOfEmployeesF2Det && noOfEmployeesF2Remark && maleF2 && maleF2Det && maleF2Remark && femaleF2 && femaleF2Det && femaleF2FileissuingAuthorityF2 && issuingAuthorityF2Det && issuingAuthorityF2Remark && numberF3 && numberF3Det && numberF3Remark && regDateF3 && regDateF3Det && regDateF3Remark && expiryDateF3 && expiryDateF3Det && expiryDateF3Remark && renewalDateF3 && renewalDateF3Det && renewalDateF3Remark && managerNameF3 && managerNameF3Det && managerNameF3Remark && noOfEmployeesF3 && noOfEmployeesF3Det && noOfEmployeesF3Remark && maleF3 && maleF3Det && maleF3Remark && femaleF3 && femaleF3Det && femaleF3FileissuingAuthorityF3 && issuingAuthorityF3Det && issuingAuthorityF3Remark && numberF4 && numberF4Det && numberF4Remark && regDateF4 && regDateF4Det && regDateF4Remark && issuingAuthorityF4 && issuingAuthorityF4Det && issuingAuthorityF4Remark && numberF5 && numberF5Det && numberF5Remark && regDateF5 && regDateF5Det && regDateF5Remark && issuingAuthorityF5 && issuingAuthorityF5Det && issuingAuthorityF5Remark && isContractLabourEngagedF5 && contractLabRegNoF5 && contractLabRegNoF5Det && contractLabRegNoF5Remark && regDateContractorF5 && regDateContractorF5Det && regDateContractorF5Remark && noOfContractEmpF5 && noOfContractEmpF5Det && noOfContractEmpF5Remark && noOfContractorsF5 && noOfContractorsF5Det && noOfContractorsF5Remark && contractorNameF51 && contractorNameF51Det && contractorNameF51Remark && establishmentNameF51 && establishmentNameF51Det && establishmentNameF51Remark && regAddContractorF51 && regAddContractorF51Det && regAddContractorF51Remark && expiryDateF52 && expiryDateF52Det && expiryDateF52Remark && renewalDateF52 && renewalDateF52Det && renewalDateF52Remark && natureOfWorkF52 && natureOfWorkF52Det && natureOfWorkF52Remark && noOfEmpDeployedF52 && noOfEmpDeployedF52Det && noOfEmpDeployedF52Remark && companyTypeF53 && companyTypeF53Det && companyTypeF53Remark && contractLabLicNoF53 && contractLabLicNoF53Det && contractLabLicNoF53Remark && licenseDateF53 && licenseDateF53Det && licenseDateF53Remark && expiryDateF53 && expiryDateF53Det && expiryDateF53Remark && renewalDateF53 && renewalDateF53Det && renewalDateF53Remark && noOfWorkerF53 && noOfWorkerF53Det && noOfWorkerF53Remark && panF53 && panF53Det && panF53Remark && gstF53 && gstF53Det && gstF53Remark && pfRegF53 && pfRegF53Det && pfRegF53Remark && esicRegF53 && esicRegF53Det && esicRegF53Remark && shopsEstF53 && shopsEstF53Det && shopsEstF53Remark && lwfRegF53 && lwfRegF53Det && lwfRegF53Remark && profTaxF53 && profTaxF53Det && profTaxF53Remark && number54 && number54Det && number54Remark && regDate54 && regDate54Det && regDate54Remark && expiryDate54 && expiryDate54Det && expiryDate54Remark && renewalDate54 && renewalDate54Det && renewalDate54Remark && issuingAuthority54 && issuingAuthority54Det && issuingAuthority54Remark && number55 && number55Det && number55Remark && regDate55 && regDate55Det && regDate55Remark && expiryDate55 && expiryDate55Det && expiryDate55Remark && renewalDate55 && renewalDate55Det && renewalDate55Remark && issuingAuthoritye55 && issuingAuthoritye55Det && issuingAuthoritye55Remark && number56 && number56Det && number56Remark && regDate56 && regDate56Det && regDate56Remark && expiryDate56 && expiryDate56Det && expiryDate56Remark && renewalDate56 && renewalDate56Det && renewalDate56Remark && issuingAuthority56 && issuingAuthority56Det && issuingAuthority56Remark && number57 && number57Det && number57Remark && regDate57 && regDate57Det && regDate57Remark && expiryDate57 && expiryDate57Det && expiryDate57Remark && renewalDate57 && renewalDate57Det && renewalDate57Remark && issuingAuthority57 && issuingAuthority57Det && issuingAuthority57Remark,

        // //  F file
        // managerNameF1File && managerMobNoF1File && managerEmailF1File && managerAadharNoF1File && managerPanF1File && shopsEstLicenseF2File && numberF2File && regDateF2File && expiryDateF2File && renewalDateF2File && managerNameF2File && noOfEmployeesF2File && maleF2File && femaleF2Remark, issuingAuthorityF2File && numberF3File && regDateF3File && expiryDateF3File && renewalDateF3File && managerNameF3File && noOfEmployeesF3File && maleF3File && femaleF3Remark, issuingAuthorityF3File && numberF4File && regDateF4File && issuingAuthorityF4File && numberF5File && regDateF5File && issuingAuthorityF5File && contractLabRegNoF5File && regDateContractorF5File && noOfContractEmpF5File && noOfContractorsF5File && contractorNameF51File && establishmentNameF51File && regAddContractorF51File && expiryDateF52File && renewalDateF52File && natureOfWorkF52File && noOfEmpDeployedF52File && companyTypeF53File && contractLabLicNoF53File && licenseDateF53File && expiryDateF53File && renewalDateF53File && noOfWorkerF53File && panF53File && gstF53File && pfRegF53File && esicRegF53File && shopsEstF53File && lwfRegF53File && profTaxF53File && number54File && regDate54File && expiryDate54File && renewalDate54File && issuingAuthority54File && number55File && regDate55File && expiryDate55File && renewalDate55File && issuingAuthoritye55File && number56File && regDate56File && expiryDate56File && renewalDate56File && issuingAuthority56File && number57File && regDate57File && expiryDate57File && renewalDate57File && issuingAuthority57File,

        // G Data 
        // isLabourEngagedG, noOfClientG, clientG, regOfficeAddClientG, pincode, noOfLocContractWorkG11, regAddOfClientG11, pincode, agreementRefNoG12, agreementDateG12, agreementValidityG12, noOfWorkersEngagedG12, estCategoryG12, isClraApplicableG12, noOfForm5G13, form5DateG13, workCommencedDateG13, clraLicenseNoG13, clraLicenseDateG13, clraValidityG13, clraRenewalDueG13, clraNoOfContWorkersG13, clraNoOfManagerRespG13, clraLicenseFeeG13, securityDepositG13, contWorkCompletedDate, contWorkComplitionNotice, refundSecDepNotice, licSurrenderedDate,


// 988888888888888 
// isLabourEngagedG, isLabourEngagedGDet, isLabourEngagedGRemark, noOfClientG, noOfClientGDet, noOfClientGRemark, clientG, clientGDet, clientGRemark, regOfficeAddClientG, pincode, regOfficeAddClientGDet, regOfficeAddClientGRemark, noOfLocContractWorkG11, noOfLocContractWorkG11Det, noOfLocContractWorkG11Remark, regAddOfClientG11, pincode, regAddOfClientG11Det, regAddOfClientG11Remark, agreementRefNoG12, agreementRefNoG12Det, agreementRefNoG12Remark, agreementDateG12, agreementDateG12Det, agreementDateG12Remark, agreementValidityG12, agreementValidityG12Det, agreementValidityG12Remark, noOfWorkersEngagedG12, noOfWorkersEngagedG12Det, noOfWorkersEngagedG12Remark, estCategoryG12, estCategoryG12Det, estCategoryG12Remark, isClraApplicableG12, noOfForm5G13, noOfForm5G13Det, noOfForm5G13Remark, form5DateG13, form5DateG13Det, form5DateG13Remark, workCommencedDateG13, workCommencedDateG13Det, workCommencedDateG13Remark, clraLicenseNoG13, clraLicenseNoG13Det, clraLicenseNoG13Remark, clraLicenseDateG13, clraLicenseDateG13Det, clraLicenseDateG13Remark, clraValidityG13, clraValidityG13Det, clraValidityG13Remark, clraRenewalDueG13, clraRenewalDueG13Det, clraRenewalDueG13Remark, clraNoOfContWorkersG13, clraNoOfContWorkersG13Det, clraNoOfContWorkersG13Remark, clraNoOfManagerRespG13, clraNoOfManagerRespG13Det, clraNoOfManagerRespG13Remark, clraLicenseFeeG13, clraLicenseFeeG13Det, clraLicenseFeeG13Remark, securityDepositG13, securityDepositG13Det, securityDepositG13Remark, contWorkCompletedDate, contWorkCompletedDateDet, contWorkCompletedDateRemark, contWorkComplitionNotice, contWorkComplitionNoticeDet, contWorkComplitionNoticeRemark, refundSecDepNotice, refundSecDepNoticeDet, refundSecDepNoticeRemark, licSurrenderedDate, licSurrenderedDateDet, licSurrenderedDateRemark,



        // // G File

// isLabourEngagedGFile,
// noOfClientGFile,
// clientGFile,
// regOfficeAddClientGFile,
// noOfLocContractWorkG11File,
// regAddOfClientG11File,
// agreementRefNoG12File,
// agreementDateG12File,
// agreementValidityG12File,
// noOfWorkersEngagedG12File,
// estCategoryG12File,
// noOfForm5G13File,
// form5DateG13File,
// workCommencedDateG13File,
// clraLicenseNoG13File,
// clraLicenseDateG13File,
// clraValidityG13File,
// clraRenewalDueG13File,
// clraNoOfContWorkersG13File,
// clraNoOfManagerRespG13File,
// clraLicenseFeeG13File,
// securityDepositG13File,
// contWorkCompletedDateFile,
// contWorkComplitionNoticeFile,
// refundSecDepNoticeFile,
// licSurrenderedDateFile,




            // isEngagedFile && contLabRegNoEFile && dateOfRegEFile && noOfContractEmpEFile && noOfContractorsEFile && nameOfContractorsE1File && nameOfEstablishmentE1File && regAddContractorE1File && agreementExpiryDateE2File && agreementRenewalDateE2DetFile && natureOfWorkAgreementE2File && noOfEmpDeployedAgreementE2File && companyTypeLabourE3File && contractLabourLicNoE3File && contractLicDateE3File && contractExpiryDateE3File && contractRenewalDueDateE3File && noOfWorkersContractE3File && panContractorsE3File && gstContractorsE3File && pfRegContractorsE3File && esicRegContractorsE3File && shopsandEstContractorsE3File && lwfRegContractorsE3File && profTaxContractorsE3File && 



 // managerNameF1File && managerMobNoF1File && managerEmailF1File && managerAadharNoF1File && managerPanF1File && shopsEstLicenseF2File && numberF2File && regDateF2File && expiryDateF2File && renewalDateF2File && managerNameF2File && noOfEmployeesF2File && maleF2File &&issuingAuthorityF2File && numberF3File && regDateF3File && expiryDateF3File && renewalDateF3File && managerNameF3File && noOfEmployeesF3File && maleF3File && issuingAuthorityF3File && numberF4File && regDateF4File && issuingAuthorityF4File && numberF5File && regDateF5File && issuingAuthorityF5File && contractLabRegNoF5File && regDateContractorF5File && noOfContractEmpF5File && noOfContractorsF5File && contractorNameF51File && establishmentNameF51File && regAddContractorF51File && expiryDateF52File && renewalDateF52File && natureOfWorkF52File && noOfEmpDeployedF52File && companyTypeF53File && contractLabLicNoF53File && licenseDateF53File && expiryDateF53File && renewalDateF53File && noOfWorkerF53File && panF53File && gstF53File && pfRegF53File && esicRegF53File && shopsEstF53File && lwfRegF53File && profTaxF53File && number54File && regDate54File && expiryDate54File && renewalDate54File && issuingAuthority54File && number55File && regDate55File && expiryDate55File && renewalDate55File && issuingAuthoritye55File && number56File && regDate56File && expiryDate56File && renewalDate56File && issuingAuthority56File && number57File && regDate57File && expiryDate57File && renewalDate57File && issuingAuthority57File && 
