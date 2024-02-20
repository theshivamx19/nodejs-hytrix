import Admin from '../models/Admin.js';
import Category from '../models/Category.js';
import CheckList from '../models/CheckLists.js';
import State from '../models/State.js';
import Users from '../models/Users.js';
import Notification from '../models/Notification.js';
import Branch from '../models/Branch.js';
import Company from "../models/Company.js";
import Compliance from "../models/Compliance.js";
import fs from 'fs';
import bcryptsjs from 'bcryptjs';
import sendMail from '../utils/sendMails.js';
import generateToken from '../utils/generateToken.js';
import sharp from 'sharp';
import mongoose from 'mongoose'
import { log } from 'console';
export const login = async (req, res, next) => {
    try {
        const user = await Admin.findOne({ email: req.body.email });

        if (!user) {
            //next(createError(404,"User Not Found!"));
            return res.send("404");
        }
        const passwordDB = user.password;
        const matchPasswotd = await bcryptsjs.compare(req.body.password, passwordDB);
        if (matchPasswotd === false) {
            return res.send("400");
        }

        //now remove Password and isAdmin from User get from query as follows   
        //const { Password, isAdmin, ...otherDetails } = User;   
        //since in output of return response.json({...otherDetails}); I am getting collectable values in _doc variable so
        const { password, ...otherDetails } = user._doc;
        //now I have to install a jwt here. first install npm install jsonwebtoken and create jwt via openssl>rand -base64 32 and put it to .env file for privacy. And now create token with sign jwt token with user id and isadmin as
        const token = generateToken(user._id, 'login');//jwt.sign({id:user._id},process.env.JWT,{expiresIn:"2d"});

        //now put this token in a cookie by installing npm install cookie-parser. After this initialize this cookie-parser in index.js as app.use() and send back a cookie in response to browser with created token
        //res.cookie('access_token',token,{expire : 36000 + Date.now(), httpOnly:true}).status(200).json({...otherDetails});
        otherDetails.access_token = token;
        otherDetails.tokenexp = 2 * 24 * 60 * 60 * 1000;
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
        console.log(category)
        response.status(201).json(category);
    } catch (error) {
        // response.status(404).json({ message: error.message })
        next(error);
    }
}
export const catEditById = async (request, response, next) => {
    try {

        const name = await Category.findOne({ name: request.body.name });
        if (name) {
            return response.send("409");
        }
        let categoryUpdate = {};
        categoryUpdate = {
            name: request.body.name,
            dates: request.body.dates,
        };
        await Category.updateOne({ _id: request.params.id }, categoryUpdate);
        response.status(201).json(categoryUpdate);
    } catch (error) {
        // response.status(404).json({ message: error.message })
        next(error);
    }
}
export const deleteCat = async (request, response, next) => {
    try {
        const res = await Category.deleteOne({ _id: request.params.id });
        response.status(201).json("Category is deleted Successfully!");
    } catch (error) {
        //response.status(409).json({message: error.message});
        next(error);
    }
}
export const stateGetting = async (request, response, next) => {
    try {
        const states = await State.find();
        response.status(201).json(states);
    } catch (error) {
        // response.status(404).json({ message: error.message })
        next(error);
    }
}
export const notificationCreate = async (request, response, next) => {
    try {
        const documentFile = request.file;
        const url = request.protocol + '://' + request.get('host');
        const formattedDocumentFileName = Date.now() + request.file.originalname.split(' ').join('-');
        const uploadsDirectory = './data/uploads/';
        const documentDirectory = 'documents/';

        fs.access(uploadsDirectory, (err) => {
            if (err) {
                fs.mkdirSync(uploadsDirectory, { recursive: true });
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

        fs.writeFileSync(uploadsDirectory + documentDirectory + formattedDocumentFileName, documentFile.buffer);
        const documentUrl = url + '/' + documentDirectory + formattedDocumentFileName;
        const notification = {
            label: request.body.label,
            role: request.body.role,
            description: request.body.description,
            externallink: request.body.externallink,
            document: documentUrl,
            dates: request.body.dates,
        }
        console.log(notification);
        const newnotification = new Notification(notification);
        await newnotification.save();
        response.status(201).json(newnotification);
    } catch (error) {
        // response.status(404).json({ message: 'error.message' })
        next(error);
    }
}
export const gettingNotification = async (request, response, next) => {
    try {
        const notification = await Notification.find();
        response.status(201).json(notification);
    } catch (error) {
        // response.status(404).json({ message: error.message })
        next(error);
    }
}
export const createUser = async (request, response, next) => {
    try {

        const email = await Users.findOne({ email: request.body.email });
        if (email) {
            return response.send("409");
        }
        const data = request.body;
        const salt = bcryptsjs.genSaltSync(10);
        const passhash = bcryptsjs.hashSync(data.password, salt);
        const user = {
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.firstName + ' ' + data.lastName,
            role: data.role,
            email: data.email,
            password: passhash,
            realpassword: data.password
        }

        const newUser = new Users(user)
        await newUser.save()
        //  console.log(newUser._id);
        //await sendMail(newUser._id, newUser.email, 'email verification',data.password);
        response.status(201).json(newUser)
    } catch (error) {
        // response.status(404).json({ message: 'error.message' })
        next(error);
    }
}
export const gettingUser = async (request, response, next) => {
    try {
        const users = await Users.find().sort({ createdAt: -1 });
        response.status(201).json(users);
    } catch (error) {
        // response.status(404).json({ message: error.message })
        next(error);
    }
}
export const editUser = async (request, response, next) => {
    try {
        // console.log(request.body.email); return;
        //     const email = await Users.findOne({email:request.body.email});
        //    // console.log(email); return;
        //     if(email) {
        //         return response.send("409");
        //     }
        // console.log(email); return;
        const data = request.body;
        const salt = bcryptsjs.genSaltSync(10);
        const passhash = bcryptsjs.hashSync(data.password, salt);
        let userUpdate = {};
        userUpdate = {
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.firstName + ' ' + data.lastName,
            role: data.role,
            email: data.email,
            password: passhash,
            realpassword: data.password
        };
        await Users.updateOne({ _id: request.params.id }, userUpdate);
        response.status(201).json(userUpdate);
    } catch (error) {
        // response.status(404).json({ message: error.message })
        next(error);
    }
}
export const deleteUser = async (request, response, next) => {
    try {
        const res = await Users.deleteOne({ _id: request.params.id });
        response.status(201).json("User is deleted Successfully!");
    } catch (error) {
        //response.status(409).json({message: error.message});
        next(error);
    }
}
export const createBranch = async (request, response, next) => {
    try {

        const name = await Branch.findOne({ name: request.body.name });
        if (name) {
            return response.send("409");
        }
        const data = request.body;

        const branch = {
            name: data.name
        }

        const newbranch = new Branch(branch)
        await newbranch.save()
        //  console.log(newUser._id);
        //await sendMail(newUser._id, newUser.email, 'email verification',data.password);
        response.status(201).json(newbranch)
    } catch (error) {
        // response.status(404).json({ message: 'error.message' })
        next(error);
    }
}
export const createCompany = async (request, response, next) => {
    try {

        const companyname = await Company.findOne({ companyname: request.body.name });
        if (companyname) {
            return response.send("409");
        }
        const data = request.body;

        const company = {
            companyname: data.companyname,
            state: '65b2d649ea514009b0989736',
            branchname: '65bb474a1d06166d9d85f55c',
            executiveId: '65b2d649ea514009b0989736',
        }

        const newCompany = new Company(company)
        await newCompany.save()
        //  console.log(newUser._id);
        //await sendMail(newUser._id, newUser.email, 'email verification',data.password);
        response.status(201).json(newCompany)
    } catch (error) {
        // response.status(404).json({ message: 'error.message' })
        next(error);
    }
}
export const gettingCompany = async (request, response, next) => {
    try {
        const company = await Company.find();
        response.status(201).json(company);
    } catch (error) {
        // response.status(404).json({ message: error.message })
        next(error);
    }
}
export const gettingBranch = async (request, response, next) => {
    try {
        const branch = await Branch.find();
        response.status(201).json(branch);
    } catch (error) {
        // response.status(404).json({ message: error.message })
        next(error);
    }
}
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
        const data = request.body;
        const uploadsDirectory = './data/uploads/';
        const imageDirectory = 'images/';
        const documentDirectory = 'documents/';
        const url = request.protocol + '://' + request.get('host');
        let imageUrl, formattedImageFileName
        let documentUrl, formattedDocumentFileName

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
        if (request.files?.document !== undefined && request.files?.document[0] !== undefined) {
            const documentFile = request.files.document ? request.files.document[0] : null;
            formattedDocumentFileName = Date.now() + documentFile.originalname.split(' ').join('-');
            if (documentFile.mimetype === 'application/pdf') {
                fs.writeFileSync(uploadsDirectory + documentDirectory + formattedDocumentFileName, documentFile.buffer);
                documentUrl = url + '/' + documentDirectory + formattedDocumentFileName;
            }

        }
        if (request.files?.image !== undefined && request.files?.image[0] !== undefined) {
            const imageFile = request.files.image ? request.files.image[0] : null;
            formattedImageFileName = Date.now() + imageFile.originalname.split(' ').join('-');
            if (imageFile.mimetype.includes('image')) {
                await sharp(imageFile.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedImageFileName);
                imageUrl = url + '/' + imageDirectory + formattedImageFileName;
            }
            else if (imageFile.mimetype === 'application/pdf') {
                fs.writeFileSync(uploadsDirectory + imageDirectory + formattedImageFileName, imageFile.buffer);
                imageUrl = url + '/' + imageDirectory + formattedImageFileName;
            }
        }
        if (request.files?.document !== undefined && request.files?.document[0] !== undefined && request.files?.image !== undefined && request.files?.image[0] !== undefined) {

            const documentFile = request.files.document ? request.files.document[0] : null;
            formattedDocumentFileName = Date.now() + documentFile.originalname.split(' ').join('-');
            if (documentFile.mimetype === 'application/pdf') {
                console.log('both')
                fs.writeFileSync(uploadsDirectory + documentDirectory + formattedDocumentFileName, documentFile.buffer);
                documentUrl = url + '/' + documentDirectory + formattedDocumentFileName;
            }
            const imageFile = request.files.image ? request.files.image[0] : null;
            formattedImageFileName = Date.now() + imageFile.originalname.split(' ').join('-');
            if (imageFile.mimetype.includes('image')) {
                await sharp(imageFile.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedImageFileName);
                imageUrl = url + '/' + imageDirectory + formattedImageFileName;
            }
            else if (imageFile.mimetype === 'application/pdf') {
                fs.writeFileSync(uploadsDirectory + imageDirectory + formattedImageFileName, imageFile.buffer);
                imageUrl = url + '/' + imageDirectory + formattedImageFileName;
            }
        }
        const newArrDataRules = (data.rule).split("\n").map((data, i) => {
            return {
                id: i + 1,
                value: data
            }
        })
        const newArrDataQuestion = (data.question).split("\n").map((data, i) => {
            return {
                id: i + 1,
                value: data
            }
        })
        const newArrDataDescription = (data.description).split("\n").map((data, i) => {
            return {
                id: i + 1,
                value: data
            }
        })
        let comliancelist = {};
        comliancelist = {
            category: data.category,
            state: data.state,
            act: data.act,
            rule: data.rule,
            ruletype: newArrDataRules,
            question: data.question,
            questiontype: newArrDataQuestion,
            description: data.description,
            descriptiontype: newArrDataDescription,
            executive: data.executive,
            form: imageUrl,
            docattachment: documentUrl,
            docattachmenttype: data.docattachmenttype,
            compliancetype: data.compliancetype,
            compliancetype: data.compliancetype,
            frequency: data.frequency,
            risk: data.risk,
            updated_at: data.dates
        }
        //}
        console.log(comliancelist)
        const updatedCompliance = await Compliance.updateOne({ _id: request.params.id }, comliancelist);
        // await newComliancelistt.save()
        response.status(201).json(updatedCompliance)
    }
    catch (error) {
        next(error)
    }
}
export const gettingCompliancesOnCreate = async (request, response, next) => {
    try {
        const newArr = await Compliance.aggregate([
            {
                $match: {
                    status: { $eq: 0 }
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
        response.status(201).json(newArr)
        // const compliance = await Compliance.find({ status: { $eq: 0 } } ).populate("category").populate('state').populate("executive")
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
        // console.log()
        // response.status(201).json(newArr)
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
        response.status(201).json(newArr)
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
export const gettingCompliancesAll = async (request, response, next) => {
    try {
        const newArr = await Compliance.aggregate([
            {
                $match: {
                    status: { $eq: 1 }
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
        response.status(201).json(newArr)
        // const compliance = await Compliance.find({ status: { $eq: 1 } }).populate("category").populate('state').populate("executive")
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
        //         // executive:`${data.executive.firstName} ${data.executive.lastName}`,
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
export const gettingCompliancesReject = async (request, response, next) => {
    try {
        const newArr = await Compliance.aggregate([
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
                    rejected_at: 1,
                    reason : 1,
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
        response.status(201).json(newArr)
    }
    catch (error) {
        next(error)
    }
    // try {
    //     const compliance = await Compliance.find({ status: { $eq: 2 } } ).populate("category").populate('state').populate("executive")
    //     let newArr = compliance.map(data => {
    //         return {
    //             _id: data._id,
    //             state: data.state.name,
    //             act: data.act,
    //             rule: data.rule,
    //             category: data.category.name,
    //             question: data.question,
    //             form: data.form,
    //             docattachment: data.docattachment,
    //             compliancetype: data.compliancetype,
    //             frequency: data.frequency,
    //             description: data.description,
    //             risk: data.risk,
    //             duedate: data.duedate,
    //             status: data.status,
    //             // executive:data.executive.firstName+' '+data.executive.lastName,
    //             created_at: data.created_at,
    //             updated_at: data.updated_at
    //         }
    //     })
    //     response.status(201).json(newArr)
    // }
    // catch (error) {
    //     next(error)
    // }
}
export const complianceFilter = async (request, response, next) => {
    try {
        const stateFilter = request.body.state;
        const dateFilter = request.body.created_at;
        const matchStage = {};
        matchStage['status'] = { $eq: 0 };
        if (stateFilter !== undefined && dateFilter !== undefined && stateFilter !== "" && dateFilter !== "") {
            // Both state and createdAt are provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
            console.log('both')
        } else if (stateFilter !== undefined && stateFilter !== "") {
            // Only state is provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            console.log('state')
        } else if (dateFilter !== undefined && dateFilter !== "") {
            console.log('date')
            // Only createdAt is provided
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
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
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },

                }
            }
        ]);

        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
}
export const gettingCompliancesAllFilter = async (request, response, next) => {
    try {
        const stateFilter = request.body.state;
        const dateFilter = request.body.created_at;
        const executiveFilter = request.body.executive;

        console.log(stateFilter + '=' + dateFilter + '=' + executiveFilter);
        const matchStage = {};
        matchStage['status'] = { $eq: 1 };
        if (stateFilter !== undefined && dateFilter !== undefined && executiveFilter !== undefined && stateFilter !== "" && dateFilter !== "" && executiveFilter !== "") {
            // Both state and createdAt are provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
            console.log('both')
        } else if (stateFilter !== undefined && stateFilter !== "") {
            // Only state is provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            console.log('state')
        } else if (dateFilter !== undefined && dateFilter !== "") {
            console.log('date')
            // Only createdAt is provided
            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        } else if (executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString());
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
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                }
            }
        ]);
        console.log(filter);
        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
}
export const complianceApproveFilter = async (request, response, next) => {
    try {
        const stateFilter = request.body.state;
        const executiveFilter = request.body.executive;
        const dateFilter = request.body.created_at;
        const matchStage = {};
        matchStage['status'] = { $eq: 0 };
        if (stateFilter !== undefined && dateFilter !== undefined && executiveFilter !== undefined && stateFilter !== "" && dateFilter !== "" && executiveFilter !== "") {
            // Both state and createdAt are provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        } else if (stateFilter !== undefined && stateFilter !== "") {
            // Only state is provided
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
        else if (executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
        console.log(filter)
        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
}
// -------------------------------Compliance Rejected Filter -------------------------------

export const complianceRejectedFilter = async (request, response, next) => {
    try {
        const stateFilter = request.body.state;
        const executiveFilter = request.body.executive;
        const updatedFilter = request.body.updated_at;
        const rejectedFilter = request.body.rejected_at;
        const matchStage = {};

        if (stateFilter !== undefined && executiveFilter !== undefined && updatedFilter !== undefined && rejectedFilter !== undefined && stateFilter !== "" && executiveFilter !== "" && updatedFilter !== "" && rejectedFilter !== "") {
            // Both state and createdAt are provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())

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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())

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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())

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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())

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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())

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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())

            const updatedDateObject = new Date(updatedFilter);
            const updatedNextDay = new Date(updatedDateObject);
            updatedNextDay.setDate(updatedDateObject.getDate() + 1);
            matchStage['updated_at'] = {
                $gte: updatedDateObject,
                $lt: updatedNextDay
            };

        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && rejectedFilter !== undefined && rejectedFilter !== "") {
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())

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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        }
        matchStage['status'] = { $eq: 2 }

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
                    compliancetype: 1,
                    question: 1,
                    description: 1,
                    frequency: 1,
                    risk: 1,
                    duedate: 1,
                    status: 1,
                    reason : 1,
                    created_at: 1,
                    updated_at: 1,
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
                }
            }
        ]);

        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
};
export const gettingCompliancesById = async (request, response, next) => {
    try {
        const compliances = await Compliance.findOne({ _id: request.params.id });
        response.status(201).json(compliances);
    } catch (error) {
        next(error);
    }
}
export const complianceApporve = async (request, response, next) => {
    try {
        //console.log(request.body);return;
        const compliancesApprove = await Compliance.updateMany({ status: request.body.status, duedate: request.body.duedate });
        response.status(201).json(compliancesApprove);
    } catch (error) {
        next(error);
    }
}
export const complianceReject = async (request, response, next) => {
    try {
        //console.log(request.body);return;
        const compliances = await Compliance.updateMany({ status: request.body.status, reason: request.body.reason, rejected_at: request.body.rejected_at });
        response.status(201).json(compliances);
    } catch (error) {
        next(error);
    }
}
export const checkListCreate = async (request, response, next) => {
    try {
        // const act = await CheckList.findOne({act:request.body.act});
        // if(act) {
        //     return response.send("409");
        // }
        const data = request.body
        //  console.log('documentUrl',documentUrl)
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
        const checklist = {
            state: data.state,
            category: data.category,
            company: data.company,
            act: data.compliance,
            executive: data.executive,
            branchname: data.branch,
            compliance: data.compliance,
            rule: data.rule,
            ruletype: newArrDataRules,
            question: data.question,
            questiontype: newArrDataQuestion,
            descriptiontype: newArrDataDescription,
            description: data.description,
            image: imageUrl,
            documents: documentUrl,
            frequency: data.frequency,
            risk: data.risk,
        }
        console.log(checklist);
        const newCheckList = new CheckList(checklist)
        await newCheckList.save()
        response.status(201).json(newCheckList)
    }
    catch (error) {
        next(error)
    }
}
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
                compliance: data.compliance,
                rule: data.rule,
                category: data.category.name,
                status: data.status,
                image: data.image,
                documents: data.documents,
                question: data.question,
                executive: data.executive.firstName + " " + data.executive.lastName,
                branchname: data.branchname.name,
                risk: data.risk,
                approvedate: data.approvedate,
                created_at: data.date,
            }
        })
        response.status(200).json(newArr)
    }
    catch (error) {
        next(error);
    }
}
export const updateChecklistsById = async (request, response, next) => {
    try {
        const data = request.body;
        const uploadsDirectory = './data/uploads/';
        const imageDirectory = 'images/';
        const documentDirectory = 'documents/';
        const url = request.protocol + '://' + request.get('host');
        let imageUrl, formattedImageFileName
        let documentUrl, formattedDocumentFileName

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
        if (request.files?.document !== undefined && request.files?.document[0] !== undefined) {
            const documentFile = request.files.document ? request.files.document[0] : null;
            formattedDocumentFileName = Date.now() + documentFile.originalname.split(' ').join('-');
            if (documentFile.mimetype === 'application/pdf') {
                fs.writeFileSync(uploadsDirectory + documentDirectory + formattedDocumentFileName, documentFile.buffer);
                documentUrl = url + '/' + documentDirectory + formattedDocumentFileName;
            }

        }
        if (request.files?.image !== undefined && request.files?.image[0] !== undefined) {
            const imageFile = request.files.image ? request.files.image[0] : null;
            formattedImageFileName = Date.now() + imageFile.originalname.split(' ').join('-');
            if (imageFile.mimetype.includes('image')) {
                await sharp(imageFile.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedImageFileName);
                imageUrl = url + '/' + imageDirectory + formattedImageFileName;
            }
            else if (imageFile.mimetype === 'application/pdf') {
                fs.writeFileSync(uploadsDirectory + imageDirectory + formattedImageFileName, imageFile.buffer);
                imageUrl = url + '/' + imageDirectory + formattedImageFileName;
            }
        }
        if (request.files?.document !== undefined && request.files?.document[0] !== undefined && request.files?.image !== undefined && request.files?.image[0] !== undefined) {

            const documentFile = request.files.document ? request.files.document[0] : null;
            formattedDocumentFileName = Date.now() + documentFile.originalname.split(' ').join('-');
            if (documentFile.mimetype === 'application/pdf') {
                console.log('both')
                fs.writeFileSync(uploadsDirectory + documentDirectory + formattedDocumentFileName, documentFile.buffer);
                documentUrl = url + '/' + documentDirectory + formattedDocumentFileName;
            }
            const imageFile = request.files.image ? request.files.image[0] : null;
            formattedImageFileName = Date.now() + imageFile.originalname.split(' ').join('-');
            if (imageFile.mimetype.includes('image')) {
                await sharp(imageFile.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedImageFileName);
                imageUrl = url + '/' + imageDirectory + formattedImageFileName;
            }
            else if (imageFile.mimetype === 'application/pdf') {
                fs.writeFileSync(uploadsDirectory + imageDirectory + formattedImageFileName, imageFile.buffer);
                imageUrl = url + '/' + imageDirectory + formattedImageFileName;
            }
        }
        const newArrDataRules = (data.rule).split("\n").map((data, i) => {
            return {
                id: i + 1,
                value: data
            }
        })
        const newArrDataQuestion = (data.question).split("\n").map((data, i) => {
            return {
                id: i + 1,
                value: data
            }
        })
        const newArrDataDescription = (data.description).split("\n").map((data, i) => {
            return {
                id: i + 1,
                value: data
            }
        })
        let checklist = {};
        checklist = {
            state: data.state,
            category: data.category,
            company: data.company,
            compliances: data.compliance,
            executive: data.executive,
            branchname: data.branch,
            compliance: data.compliance,
            rule: data.rule,
            ruletype: newArrDataRules,
            question: data.question,
            questiontype: newArrDataQuestion,
            description: data.description,
            descriptiontype: newArrDataDescription,
            image: imageUrl,
            documents: documentUrl,
            frequency: data.frequency,
            approvedate: data.approvedate,
            risk: data.risk,
            created_at: data.created_at,
            updated_at: data.dates
        }
        //}
        console.log(checklist)
        const updatedChecklist = await CheckList.updateOne({ _id: request.params.id }, checklist);
        response.status(201).json(updatedChecklist)
    }
    catch (error) {
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
                $project: {
                    _id: 1,
                    category: 1,
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
                    category: { $arrayElemAt: ["$categoryData.companyname", 0] },
                    company: { $arrayElemAt: ["$companyData.name", 0] },
                    branchname: { $arrayElemAt: ["$branchData.name", 0] },
                    compliance: { $arrayElemAt: ["$complianceData.act", 0] },
                }
            }
        ])

        console.log(newArr)
        response.status(201).json(newArr)
    }
    catch (error) {
        next(error)
    }
}
export const checklistAllgetting = async (request, response, next) => {
    try {
        const newArr = await CheckList.aggregate([
            {
                $match: {
                    status: { $eq: 1 }
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
                $project: {
                    _id: 1,
                    category: 1,                    
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
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.companyname", 0] },
                    branchname: { $arrayElemAt: ["$branchData.name", 0] },
                    compliance: { $arrayElemAt: ["$complianceData.act", 0] },
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
        response.status(201).json(newArr)
    }
    catch (error) {
        next(error)
    }
}
export const gettingchecklistById = async (request, response, next) => {
    try {

        const checklist = await CheckList.findOne({ _id: request.params.id });
        //console.log(checklist);return;
        response.status(201).json(checklist);
    } catch (error) {
        next(error);
    }
}
export const checklistApporve = async (request, response, next) => {
    try {
        //console.log(request.body);return;
        const checklistApprove = await CheckList.updateMany({ status: request.body.status, approvedate: request.body.approvedate });
        response.status(201).json(checklistApprove);
    } catch (error) {
        next(error);
    }
}
export const checklistApprovegetting = async (request, response, next) => {
    try {
        // const compliance = await Compliance.find({ $and: [ { status: { $eq: 0 } }, { executive: { $ne: '659d4f2609c9923c9e7b8f72' } } ] }).populate("category").populate('state')
        const matchStage = {}
        // matchStage['status'] = {$eq : 0}
        // matchStage['executive'] = { $ne: '659d4f2609c9923c9e7b8f72' }
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
                $project: {
                    _id: 1,
                    category: 1,                    
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
                    company: { $arrayElemAt: ["$companyData.companyname", 0] },
                    branchname: { $arrayElemAt: ["$branchData.name", 0] },
                    compliance: { $arrayElemAt: ["$complianceData.act", 0] },
                }
            }
        ])
        console.log(newArr)
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
                $project: {
                    _id: 1,
                    category: 1,                    
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
                    reason : 1,
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
                    branchname: { $arrayElemAt: ["$branchData.name", 0] },
                    compliance: { $arrayElemAt: ["$complianceData.act", 0] },
                }
            }
        ])
        console.log(newArr)
        response.status(201).json(newArr)
    }
    catch (error) {
        next(error)
    }
}
export const rejectChecklist = async (request, response, next) => {
    try {
        //console.log(request.body);return;
        const compliances = await CheckList.updateMany({ status: request.body.status, reason: request.body.reason, rejected_at: request.body.rejected_at });
        response.status(201).json(compliances);
    } catch (error) {
        next(error);
    }
}
export const gettingchecklistAllCompliance = async (request, response, next) => {
    try {
        //console.log(request.body);return;
        const compliancesforchecklist = await Compliance.find({});
        response.status(201).json(compliancesforchecklist);
    } catch (error) {
        next(error);
    }
}
// ------------------------------- Checklist All Filter-------------------------------------
export const checkListAllFilter = async (request, response, next) => {
    try {

        const stateFilter = request.body.state;
        const companyFilter = request.body.company;
        const executiveFilter = request.body.executive;
        const dateFilter = request.body.created_at;

        const matchStage = {};
        matchStage['status'] = { $eq: 1 }
        if (stateFilter !== undefined && dateFilter !== undefined && executiveFilter !== undefined && companyFilter !== undefined && stateFilter !== "" && dateFilter !== "" && executiveFilter !== "" && companyFilter !== "") {
            // Both state and createdAt are provided
            console.log('you are in all');
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
            matchStage['created_at'] = {
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
            matchStage['created_at'] = {
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
            matchStage['created_at'] = {
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
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (dateFilter !== undefined && dateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (dateFilter !== undefined && dateFilter !== "" && companyFilter !== undefined && companyFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (dateFilter !== undefined && dateFilter !== "" && stateFilter !== undefined && stateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
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
            matchStage['created_at'] = {
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
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (companyFilter !== undefined && companyFilter !== "" && stateFilter !== undefined && stateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (executiveFilter !== undefined && executiveFilter !== "") {
            // matchStage['admin'] = "659d4f2609c9923c9e7b8f72"
            matchStage['admin'] = new mongoose.Types.ObjectId("659d4f2609c9923c9e7b8f72")
        }
        else if (stateFilter !== undefined && stateFilter !== "") {
            console.log('you are in state');
            // Only state is provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());;
        }
        else if (executiveFilter !== undefined && executiveFilter !== "") {
            console.log('you are in exeec');
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        }
        else if (companyFilter !== undefined && companyFilter !== "") {
            console.log('you are in company');
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (dateFilter !== undefined && dateFilter !== "") {
            // Only createdAt is provided
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
                    from: "compliances",
                    localField: "compliance",
                    foreignField: "_id",
                    as: "complianceData",
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
                $project: {
                    _id: 1,
                    approvedate: 1,
                    status: 1,
                    image: 1,
                    documents: 1,
                    rule: 1,
                    description: 1,
                    question: 1,
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
                    company: { $arrayElemAt: ["$companyData.companyname", 0] },
                    compliance: { $arrayElemAt: ["$complianceData.act", 0] },
                    branchname: { $arrayElemAt: ["$branchData.name", 0] },
                }
            }
        ]);
        console.log(filter);

        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
}

// ------------------------------- Checklist Approve Filter----------------------------------
export const checkListApproveFilter = async (request, response, next) => {
    try {

        const stateFilter = request.body.state;
        const companyFilter = request.body.company;
        const executiveFilter = request.body.executive;
        const branchFilter = request.body.branchname;
        const dateFilter = request.body.created_at;

        const matchStage = {};
        matchStage['status'] = { $eq: 0 };
        if (stateFilter !== undefined && dateFilter !== undefined && executiveFilter !== undefined && companyFilter !== undefined && branchFilter !== undefined && stateFilter !== "" && dateFilter !== "" && executiveFilter !== "" && companyFilter !== "" && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())

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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
                    rule: 1,
                    description: 1,
                    question: 1,
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

        ]);
        console.log('filter', filter);
        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
}

// ------------------------------------- Checklist Create Filter-----------------------------------

export const checkListCreateFilter = async (request, response, next) => {
    try {

        const stateFilter = request.body.state;
        const companyFilter = request.body.company;
        const branchFilter = request.body.branchname;
        const dateFilter = request.body.created_at;

        const matchStage = {};
        matchStage['status'] = { $eq: 0 };
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
                    rule: 1,
                    description: 1,
                    question: 1,
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
        const dateFilter = request.body.created_at;

        const matchStage = {};
        matchStage['status'] = { $eq: 2 };
        if (stateFilter !== undefined && dateFilter !== undefined && executiveFilter !== undefined && companyFilter !== undefined && branchFilter !== undefined && stateFilter !== "" && dateFilter !== "" && executiveFilter !== "" && companyFilter !== "" && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (stateFilter !== undefined && stateFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())

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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString())

        }
        else if (companyFilter !== undefined && companyFilter !== "" && executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        }
        else if (companyFilter !== undefined && companyFilter !== "" && branchFilter !== undefined && branchFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString());
            matchStage['branchname'] = new mongoose.Types.ObjectId(branchFilter.toString());
        }
        else if (companyFilter !== undefined && companyFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            console.log("You are in company and date");
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
            matchStage['executiveFilter'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        }
        else if (companyFilter !== undefined && companyFilter !== "") {
            console.log('i am in company');
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
                    rule: 1,
                    description: 1,
                    question: 1,
                    frequency: 1,
                    risk: 1,
                    created_at: 1,
                    rejected_at: 1,
                    reason : 1,
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

