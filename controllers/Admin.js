import Admin from '../models/Admin.js';
import Category from '../models/Category.js';
import CheckList from '../models/CheckList.js';
import State from '../models/State.js';
import Users from '../models/User.js';
import Notification from '../models/Notification.js';
import Branch from '../models/Branch.js';
import Companydata from "../models/Companydata.js";
import Company from "../models/Company.js";
import Compliance from "../models/Compliances.js";
import Lisereg from "../models/Lisereg.js";
import Audit from "../models/Audit.js";
import Elibrary from "../models/Elibrary.js";
// import RegistrationB from "../models/company/RegistrationB.js";
import fs from 'fs';
import bcryptsjs from 'bcryptjs';
import sendMail from '../utils/sendMails.js';
import generateToken from '../utils/generateToken.js';
import sharp from 'sharp';
import mongoose from 'mongoose'
import { log } from 'console';
import { request } from 'http';
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
        otherDetails.tokenexp = 60 * 24 * 60 * 60 * 1000;
        res.cookie('access_token', token, { maxAge: (60 * 24 * 60 * 60 * 1000) /* cookie will expires in 20 days*/, httpOnly: true }).status(201).json({ ...otherDetails });

    } catch (error) {
        //res.status(400).json({ message: error.message });
        next(error);
    }
}
export const logout = async (request, response, next) => {
    //response.clearCookie("access_token");
    const token = request.cookies.access_token;
    //console.log(token);//return;
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
export const createAudit = async (request, response, next) => {
    try {
        const data = request.body
        const { title, company, branch, state, executive, auditor, scope, briefauditor, checkboxlist, auditstatus, status, risk, start_date, end_date } = data
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        const audit = {
            title, company, branch, state, executive, auditor, scope, briefauditor, checkboxlist, auditstatus, status, risk, start_date: startDate, end_date: endDate
        }
        const newAudit = new Audit(audit)
        await newAudit.save()
        response.status(201).json(newAudit)
    } catch (error) {
        next(error)
    }
}
export const auditoreGet = async (request, response, next) => {
    try {
        const auditor = await Users.find({ role: { $eq: "Auditor" } });
        response.status(201).json(auditor);
    } catch (error) {
        // response.status(404).json({ message: 'error.message' })
        next(error);
    }
}
export const executiveGet = async (request, response, next) => {
    try {
        const auditor = await Users.find(
            {
                $and: [
                    { role: { $eq: "Auditor" } },
                    { $eq: "Executive(Matrix)" }]
            }
        );

        response.status(201).json(auditor);
    } catch (error) {
        // response.status(404).json({ message: 'error.message' })
        next(error);
    }
}
export const auditchecklistGetonCreate = async (request, response, next) => {  //checklist on create of audit list
    // console.log('sasasasssas');return;
    try {
        const newArr = await CheckList.aggregate([
            {
                $match: { status: { $ne: 2 } }
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
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.companyname", 0] },
                    branchname: { $arrayElemAt: ["$branchData.name", 0] },
                    compliance: { $arrayElemAt: ["$complianceData.act", 0] },
                }
            }
        ])
        // console.log(newArr)
        response.status(201).json(newArr)
    }
    catch (error) {
        next(error)
    }
}
export const auditChecklistFilter = async (request, response, next) => {
    try {
        const stateFilter = request.body.state;
        const branchFilter = request.body.branch;
        const categoryFilter = request.body.category;
        const complianceFilter = request.body.compliance;

        const matchStage = {};
        matchStage['status'] = { $ne: 2 }

        if (stateFilter !== undefined && complianceFilter !== undefined && categoryFilter !== undefined && branchFilter !== undefined && stateFilter !== "" && complianceFilter !== "" && categoryFilter !== "" && branchFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['category'] = new mongoose.Types.ObjectId(categoryFilter.toString())
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
                    // category: 1,
                    form: 1,
                    document: 1,
                    question: 1,
                    description: 1,
                    created_at: 1,
                    risk: 1,
                    consequences: 1,
                    frequency: 1,
                    duedate: 1,
                    remark: 1,
                    compliance: { $arrayElemAt: ["$complianceData.act", 0] },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    branch: { $arrayElemAt: ["$branchData.name", 0] },
                }
            }
        ]);
        console.log(filter)
        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
}
export const gettingOnGoingAuditDetail = async (request, response, next) => {
    try {
        const auditOnGoing = await Audit.find({ auditstatus: { $eq: "1" } });
        response.status(201).json(auditOnGoing);
    } catch (error) {
        // response.status(404).json({ message: 'error.message' })
        next(error);
    }
}
export const gettingAuditDetail = async (request, response, next) => {
    try {
        const auditData = await Audit.aggregate([
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

        response.status(200).json(auditData);
    } catch (error) {
        next(error);
    }
}
export const gettingAuditorOverdueDashboard = async (request, response, next) => {
    try {
        const auditData = await Audit.aggregate([
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
        let users = await Users.find({})
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
        response.status(200).json(count);
        // response.status(200).json(auditData);
    } catch (error) {
        next(error);
    }
}
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
                    from: "users",
                    localField: "auditor",
                    foreignField: "_id",
                    as: "auditorData"
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
                    localField: "branch",
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
                    auditstatus: 1,
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
                    auditor: {
                        $concat: [
                            { $arrayElemAt: ["$auditorData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$auditorData.lastName", 0] }
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
        if (overdue !== undefined && overdue !== "") {
            // const currentDate = new Date();
            auditDataFilter = auditDataFilter.filter(doc => {
                return doc.overdue == overdue
            });
        }
        console.log(auditDataFilter);

        response.status(200).json(auditDataFilter);
    } catch (error) {
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
        // console.log(category)
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
        // console.log(notification);
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
// export const createCompany = async (request, response, next) => {
//     try {

//         const companyname = await Company.findOne({ companyname: request.body.name });
//         if (companyname) {
//             return response.send("409");
//         }
//         const data = request.body;

//         const company = {
//             companyname: data.companyname,
//             state: '65b2d649ea514009b0989736',
//             branchname: '65bb474a1d06166d9d85f55c',
//             executiveId: '65b2d649ea514009b0989736',
//         }

//         const newCompany = new Company(company)
//         await newCompany.save()
//         //  console.log(newUser._id);
//         //await sendMail(newUser._id, newUser.email, 'email verification',data.password);
//         response.status(201).json(newCompany)
//     } catch (error) {
//         // response.status(404).json({ message: 'error.message' })
//         next(error);
//     }
// }

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
        //console.log(comliancelist);return;
        const updatedCompliance = await Compliance.updateOne({ _id: request.params.id }, comliancelist);
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
                    act: 1,
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
        // console.log(newArr)
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
                    act: 1,
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
        // console.log(newArr)
        response.status(201).json(newArr)
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
                    act: 1,
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
        // console.log(newArr)
        response.status(201).json(newArr)
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
                    act: 1,
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
                    reason: 1,
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
        // console.log(newArr)
        response.status(201).json(newArr)
    }
    catch (error) {
        next(error)
    }
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
        // console.log('gettingCompliancesAllFilter');
        const stateFilter = request.body.state;
        const companyFilter = request.body.company;
        const executiveFilter = request.body.executive;
        const dateFilter = request.body.created_at;

        const matchStage = {};
        matchStage['status'] = { $eq: 1 }
        if (stateFilter !== undefined && dateFilter !== undefined && executiveFilter !== undefined && stateFilter !== "" && dateFilter !== "" && executiveFilter !== "") {
            // Both state and createdAt are provided
            console.log('you are in all');
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            // matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

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
            // matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

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
        else if (stateFilter !== undefined && stateFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            // matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (executiveFilter !== undefined && executiveFilter !== "" && dateFilter !== undefined && dateFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            // matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            // matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
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
        else if (dateFilter !== undefined && dateFilter !== "") {
            // matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

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
        else if (stateFilter !== undefined && stateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            // matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

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

        else if (executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
            // matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (dateFilter !== undefined && dateFilter !== "") {
            // matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())

            const dateObject = new Date(dateFilter);
            const nextDay = new Date(dateObject);
            nextDay.setDate(dateObject.getDate() + 1);
            matchStage['created_at'] = {
                $gte: dateObject,
                $lt: nextDay
            };
        }
        else if (stateFilter !== undefined && stateFilter !== "") {
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
            // matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (executiveFilter !== undefined && executiveFilter !== "") {
            // matchStage['admin'] = "659d4f2609c9923c9e7b8f72"
            matchStage['admin'] = new mongoose.Types.ObjectId("659d4f2609c9923c9e7b8f72")
        }
        else if (stateFilter !== undefined && stateFilter !== "") {
            console.log('you are in state amitabh');
            // Only state is provided
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());;
        }
        else if (executiveFilter !== undefined && executiveFilter !== "") {
            console.log('you are in exeec');
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        }
        // else if (companyFilter !== undefined && companyFilter !== "") {
        //     console.log('you are in company');
        //     matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        // }
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
            // {
            //     $lookup: {
            //         from: "companies",
            //         localField: "company",
            //         foreignField: "_id",
            //         as: "companyData",
            //     },
            // },
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
                    updated_at: 1,
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    // company: { $arrayElemAt: ["$companyData.companyname", 0] },
                }
            }
        ]);
        // console.log('filter', filter);
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
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
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
        // console.log(filter)
        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
}
// -------------------------------Compliance Rejected Filter -------------------------------

export const complianceRejectedFilter = async (request, response, next) => {
    try {
        // const findAllComp = await Compliance.find({}).populate('state')
        // console.log(findAllComp);

        const stateFilter = request.body.state;
        const executiveFilter = request.body.executive;
        const updatedFilter = request.body.updated_at;
        const rejectedFilter = request.body.rejected_at;

        // findAllComp.filter(data=>{

        // })
        // console.log(request.query);
        const matchStage = {};

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
                    reason: 1,
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
        // console.log(checklist);
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
        // console.log(checklist)
        const updatedChecklist = await CheckList.updateOne({ _id: request.params.id }, checklist);
        response.status(201).json(updatedChecklist)
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
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.companyname", 0] },
                    branchname: { $arrayElemAt: ["$branchData.name", 0] },
                    compliance: { $arrayElemAt: ["$complianceData.act", 0] },
                }
            }
        ])
        // console.log(newArr)
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
        // console.log(newArr)
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
        // console.log(newArr)
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
                    rule: 1,
                    question: 1,
                    description: 1,
                    image: 1,
                    documents: 1,
                    frequency: 1,
                    risk: 1,
                    created_at: 1,
                    rejected_at: 1,
                    reason: 1,
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
        // console.log(newArr)
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
        // console.log(filter);

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
        // console.log(request.body);
        const matchStage = {};
        matchStage['status'] = { $eq: 0 };
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
        // console.log('filter', filter);
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
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilterFilter.toString());
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
        // console.log(stateFilter + '=' + companyFilter + '=' + executiveFilter + '=' + branchFilter + '=' + dateFilter)

        const matchStage = {};
        matchStage['status'] = { $eq: 2 };
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
            console.log("You are in state");
            matchStage['state'] = new mongoose.Types.ObjectId(stateFilter.toString());
        }
        else if (executiveFilter !== undefined && executiveFilter !== "") {
            matchStage['executive'] = new mongoose.Types.ObjectId(executiveFilter.toString())
        }
        else if (companyFilter !== undefined && companyFilter !== "") {
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (branchFilter !== undefined && branchFilter !== "") {
            console.log("You are in branch");
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
                    reason: 1,
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

        ]);
        // console.log(filter)
        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
}
export const createLiseReg = async (request, response, next) => {
    try {
        const data = request.body
        let { regNo, rate, docReqDate, docReqFollow, docReviewDate, docRemark, docStatus, appliedDate, applicationStatus, applicationRemark, challlanFees, challanNumber, challanDate, directExpenses, inDirectExpenses, totalExpenses, licenseNumber, dateOfIssue, expireDate, renewalDate, licenseUploadType, invoiceType, invoiceDate, invoiceNumber, submissionDate, company, executive, state, branch, created_at
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
            response.send("409");
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
        // console.log(lastInsertedId[0].regNo);

        // const  getregNoandrate = getregNoandrates();


        if (documents && docReqDate && docReqFollow && docReviewDate && docStatus && docRemark) {
            console.log('you are in docremark');
            liseReg = {
                documents: docImageUrl, docReqDate, docReqFollow, docReviewDate, docStatus, docRemark
            }
            // const newLiseReg = await Lisereg.findOneAndUpdate({ regNo }, liseReg, { new: true })
            // response.status(201).json(newLiseReg)
        }
        if (applicationRemark && appliedDate && applicationStatus && acknowledge) {
            console.log('you are in ack');

            liseReg = {
                appliedDate, applicationStatus, applicationRemark, acknowledge: ackImageUrl
            }
            // const newLiseReg = await Lisereg.findOneAndUpdate({ regNo }, liseReg, { new: true })
            // response.status(201).json(newLiseReg)
        }
        if (challlanFees && challanNumber && challanDate && challanUpload && directExpenses && inDirectExpenses && totalExpenses) {
            console.log('you are in totalexpenses');
            const checkChallanNumber = await Lisereg.findOne({ challanNumber })
            if (checkChallanNumber) {
                response.send("409");// return response.send({ message: "409, Challan Number is already exists!" })
            }
            liseReg = {
                challlanFees, challanNumber, challanDate, challanUpload: challanImageUrl, directExpenses, inDirectExpenses, totalExpenses
            }
            // const newLiseReg = await Lisereg.findOneAndUpdate({ regNo }, liseReg, { new: true })
            // response.status(201).json(newLiseReg)
        }


        if (dateOfIssue && expireDate && renewalDate && licenseUpload) {
            console.log('you are in licenseupload');
            liseReg = {
                licenseNumber, dateOfIssue, expireDate, renewalDate, licenseUpload: licImageUrl
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
                response.send("409");// return response.send({ message: "409, Invoice Number is already exists!" })
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
                    docStatus: 1,
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
                    company: { $arrayElemAt: ["$companyData.companyname", 0] },
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
export const liseRegUpdateById = async (request, response, next) => {
    try {
        const liseRegId = request.params.id
        // const checkLiseRegId = await Lisereg.findById({ _id: liseRegId })
        // if (!checkLiseRegId) {
        //     response.status(404).json("Given lisereg id doesn't exists")
        // }

        const data = request.body

        let { rate, docReqDate, docReqFollow, docReviewDate, docRemark, docStatus, appliedDate, applicationStatus, applicationRemark, challlanFees, challanNumber, challanDate, directExpenses, inDirectExpenses, totalExpenses, dateOfIssue, expireDate, renewalDate, invoiceType, invoiceDate, submissionDate, company, executive, state, branch, updated_at
        } = data

        let docImageUrl, ackImageUrl, challanImageUrl, licImageUrl, formattedDocName, formattedAckName, formattedChallanName, formattedLicName, documents, acknowledge, licenseUpload, challanUpload, newLiseReg, liseReg;

        // console.log(data);
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
        // console.log(request.files);//return;
        if (request.files?.challanUpload !== undefined && request.files.challanUpload[0] !== undefined) {
            challanUpload = request.files.challanUpload[0];
            if (challanUpload) {
                formattedChallanName = Date.now() + challanUpload.originalname.split(' ').join('-');
                await sharp(challanUpload.buffer).resize({ width: 600 }).toFile(uploadsDirectory + imageDirectory + formattedChallanName);
                challanImageUrl = url + '/' + imageDirectory + formattedChallanName;
            }
        }
        if (rate) {
            console.log('you are here');
            liseReg = {
                rate
            }
        }
        if (documents || docReqDate && docReqFollow && docReviewDate && docStatus && docRemark) {
            console.log('you are in docremark');
            if (documents) {
                liseReg = {
                    documents: docImageUrl, docReqDate, docReqFollow, docReviewDate, docStatus, docRemark
                }
            }
            else {
                liseReg = {
                    docReqDate, docReqFollow, docReviewDate, docStatus, docRemark
                }
            }
        }
        if (applicationRemark && appliedDate && applicationStatus || acknowledge) {
            console.log('you are in ack');
            if (acknowledge) {
                liseReg = {
                    appliedDate, applicationStatus, applicationRemark, acknowledge: ackImageUrl
                }
            }
            else {
                liseReg = {
                    appliedDate, applicationStatus, applicationRemark,
                }
            }
        }
        if (challlanFees && challanDate && directExpenses && inDirectExpenses && totalExpenses || challanUpload) {
            console.log('you are in totalexpenses');
            // const checkChallanNumber = await Lisereg.findOne({ challanNumber })
            // if (checkChallanNumber) {
            //     return response.send({ message: "409, Challan Number already exists" })
            // }
            if (challanUpload) {
                liseReg = {
                    challlanFees, challanDate, challanUpload: challanImageUrl, directExpenses, inDirectExpenses, totalExpenses
                }
            } else {
                liseReg = {
                    challlanFees, challanNumber, challanDate, directExpenses, inDirectExpenses, totalExpenses
                }
            }
        }
        if (dateOfIssue && expireDate && renewalDate || licenseUpload) {
            console.log('you are in licenseupload');
            if (licenseUpload) {
                liseReg = {
                    dateOfIssue, expireDate, renewalDate, licenseUpload: licImageUrl
                }
            }
            else {
                liseReg = {
                    dateOfIssue, expireDate, renewalDate
                }
            }
        }
        if (invoiceType && invoiceDate && submissionDate) {
            console.log('you are in submission date');

            liseReg = {
                invoiceType, invoiceDate, submissionDate
            }
        }
        if (branch && company && executive && state) {
            console.log('you are in branch, Done!!');
            liseReg = {
                company, executive, branch, state, updated_at
            }
        }
        console.log('finish');
        newLiseReg = await Lisereg.findByIdAndUpdate({ _id: liseRegId }, liseReg, { new: true })
        response.status(201).json(newLiseReg)

    } catch (error) {
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
        // console.log(request.body);
        const matchStage = {};
        matchStage['status'] = { $eq: 0 }

        if (stateFilter !== undefined && dateFilter !== undefined && executiveFilter !== undefined && companyFilter !== undefined && branchFilter !== undefined && stateFilter !== "" && dateFilter !== "" && executiveFilter !== "" && companyFilter !== "" && branchFilter !== "") {
            console.log('in all')
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
            console.log('with 4 filter')
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
            console.log('i m in company alone');
            matchStage['company'] = new mongoose.Types.ObjectId(companyFilter.toString())
        }
        else if (branchFilter !== undefined && branchFilter !== "") {
            matchStage['branch'] = new mongoose.Types.ObjectId(branchFilter.toString())
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
                    localField: "branch",
                    foreignField: "_id",
                    as: "branchData",
                },
            },
            {
                $project: {
                    _id: 1,
                    approvedate: 1,
                    approvalStatus: 1,
                    sentDate: 1,
                    created_at: 1,
                    regNo: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.companyname", 0] },
                    branch: { $arrayElemAt: ["$branchData.name", 0] },
                }
            }

        ]);
        // console.log(filter)
        response.status(201).json(filter);
    } catch (error) {
        next(error);
    }
}

export const regsApporve = async (request, response, next) => {
    try {
        const objectapprove = { status: request.body.status, approvedate: request.body.approvedate }
        const riseregsApprove = await Lisereg.updateOne({ _id: request.body.id }, { $set: objectapprove },)
        response.status(201).json(riseregsApprove);
    } catch (error) {
        next(error);
    }
}
export const liseRegGettingById = async (request, response, next) => {
    try {
        const liseRegGettingByIDobj = await Lisereg.findById({ _id: request.params.id })
        const newObj = {};
        {
            newObj._id = liseRegGettingByIDobj._id,
                newObj.regNo = liseRegGettingByIDobj.regNo,
                newObj.rate = liseRegGettingByIDobj.rate.toString(),
                newObj.documents = liseRegGettingByIDobj.documents,
                newObj.docReqDate = liseRegGettingByIDobj.docReqDate,
                newObj.docReqFollow = liseRegGettingByIDobj.docReqFollow,
                newObj.docReviewDate = liseRegGettingByIDobj.docReviewDate,
                newObj.docStatus = liseRegGettingByIDobj.docStatus,
                newObj.appliedDate = liseRegGettingByIDobj.appliedDate,
                newObj.remark = liseRegGettingByIDobj.remark,
                newObj.applicationStatus = liseRegGettingByIDobj.applicationStatus,
                newObj.applicationRemark = liseRegGettingByIDobj.applicationRemark,
                newObj.acknowledge = liseRegGettingByIDobj.acknowledge,
                newObj.challlanFees = liseRegGettingByIDobj.challlanFees.toString(),
                newObj.challanNumber = liseRegGettingByIDobj.challanNumber,
                newObj.challanDate = liseRegGettingByIDobj.challanDate,
                newObj.challanUpload = liseRegGettingByIDobj.challanUpload
            newObj.directExpenses = liseRegGettingByIDobj.directExpenses.toString(),
                newObj.inDirectExpenses = liseRegGettingByIDobj.inDirectExpenses.toString(),
                newObj.totalExpenses = liseRegGettingByIDobj.totalExpenses.toString(),
                newObj.licenseNumber = liseRegGettingByIDobj.licenseNumber,
                newObj.dateOfIssue = liseRegGettingByIDobj.dateOfIssue,
                newObj.renewalDate = liseRegGettingByIDobj.renewalDate,
                newObj.expireDate = liseRegGettingByIDobj.expireDate,
                newObj.licenseUpload = liseRegGettingByIDobj.licenseUpload,
                newObj.invoiceType = liseRegGettingByIDobj.invoiceType,
                newObj.invoiceDate = liseRegGettingByIDobj.invoiceDate,
                newObj.invoiceNumber = liseRegGettingByIDobj.invoiceNumber,
                newObj.submissionDate = liseRegGettingByIDobj.submissionDate,
                newObj.branch = liseRegGettingByIDobj.branch,
                newObj.company = liseRegGettingByIDobj.company,
                newObj.state = liseRegGettingByIDobj.state,
                newObj.executive = liseRegGettingByIDobj.executive,
                newObj.status = liseRegGettingByIDobj.status,
                newObj.applicationStatus = liseRegGettingByIDobj.applicationStatus,
                newObj.docRemark = liseRegGettingByIDobj.docRemark
        }

        response.status(201).json(newObj)
    }
    catch (error) {
        next(error)
    }
}
export const elibraryCreate = async (request, response, next) => {
    try {
        const imageFile = request.file;
        const url = request.protocol + '://' + request.get('host');
        let imageUrl, formattedImageFileName
        const uploadsDirectory = './data/uploads/';
        const imageDirectory = 'images/';
        // console.log(imageFile);


        fs.access(uploadsDirectory, (err) => {
            if (err) {
                fs.mkdirSync(uploadsDirectory, { recursive: true });
            }
        });

        // Ensure that the documents directory exists
        fs.access(uploadsDirectory + imageDirectory, (err) => {
            if (err) {
                fs.mkdirSync(uploadsDirectory + imageDirectory, { recursive: true });
            }
        });
        if (imageFile) {
            formattedImageFileName = Date.now() + imageFile.originalname.split(' ').join('-');
            await sharp(request.file.buffer).resize({ width: 600 }).toFile('./data/uploads/' + formattedImageFileName);
            imageUrl = url + '/' + formattedImageFileName;
        }

        const elibrary = {
            label: request.body.label,
            role: request.body.role,
            description: request.body.description,
            image: imageUrl,
            dates: request.body.dates,
            state: request.body.state
        }
        // console.log(notification);
        const newelibrary = new Elibrary(elibrary);
        await newelibrary.save();
        response.status(201).json(newelibrary);
    } catch (error) {
        // response.status(404).json({ message: 'error.message' })
        next(error);
    }
}
// export const createCompany = async (request, response, next) => {
//     try {
//         const data = request.body;
//         const {
//             companyregistration, companyregistrationdetails, companyregistrationremark, companycin, companycindetails, companycinremark, companyissuedplace, companyissuedplacedetails, companyissuedplaceremark, companyauthority, companyauthoritydetails, companyauthorityremark, companyregistrationdate, companypan, companypandetails, companypanremark, companytan, companytandetails, companytanremark, companytin, companytindetails, companytinremark, companygst, companygstdetails, companygstremark, RegistrationB1, RegistrationB2, RegistrationB3, created_at
//         } = data;
//         let dataB1,dataB2,dataB3
//         const uploadImage = async (imageFile) => {
//             if (!imageFile) {
//                 return null; // Return null if image is not provided
//             }

//             const url = request.protocol + '://' + request.get('host');
//             const uploadsDirectory = './data/uploads/';
//             const imageDirectory = 'images/';

//             // return await Promise.all(files.map(async (imageFile) => {
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
//             // }));
//         };

//         if (RegistrationB1 !== undefined && RegistrationB1.length > 0) {
//             dataB1 = await Promise.all(RegistrationB1.map(async (item, index) => ({
//                 ...item,
//                 nameimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB1[${index}][nameimage]`)),
//                 dinimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB1[${index}][dinimage]`)),
//                 panimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB1[${index}][panimage]`)),
//                 aadhaarimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB1[${index}][aadhaarimage]`)),
//             })));
//         }
//         // Process images for RegistrationB2
//         if (RegistrationB2 !== undefined && RegistrationB2.length > 0) {
//             dataB2 = await Promise.all(RegistrationB2.map(async (item, index) => ({
//                 ...item,
//                 nameimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB2[${index}][nameimage]`)),
//                 designationimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB2[${index}][designationimage]`)),
//                 panimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB2[${index}][panimage]`)),
//                 aadhaarimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB2[${index}][aadhaarimage]`)),
//             })));
//         }

//         // Process images for RegistrationB3
//         if (RegistrationB3 !== undefined && RegistrationB3.length > 0) {
//             dataB3 = await Promise.all(RegistrationB3.map(async (item,index) => ({
//                 ...item,
//                 nameimage: await uploadImage(request.files.find(img => img.fieldname === `RegistrationB3[${index}][nameimage]`)),
//                 panimage: await uploadImage(request.files.find(img => img.fieldname ===  `RegistrationB3[${index}][panimage]`)),
//                 aadhaarimage: await uploadImage(request.files.find(img => img.fieldname ===  `RegistrationB3[${index}][aadhaarimage]`)),
//             })));
//         }
//         const company = {
//             companyregistrationimage: await uploadImage(request.files.find(img => img.fieldname === "companyregistrationimage")),
//             companyciniamge: await uploadImage(request.files.find(img => img.fieldname === "companyciniamge")),
//             companyissuedplaceimage: await uploadImage(request.files.find(img => img.fieldname === "companyissuedplaceimage")),
//             companyauthorityimage: await uploadImage(request.files.find(img => img.fieldname === "companyauthorityimage")),
//             companypanimage: await uploadImage(request.files.find(img => img.fieldname === "companypanimage")),
//             companytanimage: await uploadImage(request.files.find(img => img.fieldname === "companytanimage")),
//             companytinimage: await uploadImage(request.files.find(img => img.fieldname === "companytinimage")),
//             companygstimage: await uploadImage(request.files.find(img => img.fieldname === "companygstimage")),
//             companyregistration, companyregistrationdetails, companyregistrationremark, companycin, companycindetails, companycinremark, companyissuedplace, companyissuedplacedetails, companyissuedplaceremark, companyauthority, companyauthoritydetails, companyauthorityremark, companyregistrationdate, companypan, companypandetails, companypanremark, companytan, companytandetails, companytanremark, companytin, companytindetails, companytinremark, companygst, companygstdetails, companygstremark, RegistrationB1: dataB1, RegistrationB2: dataB2, RegistrationB3: dataB3, created_at
//         };

//         const newCompany = new RegistrationB(company);
//         await newCompany.save();
//         response.status(201).json(newCompany);
//     } catch (error) {
//         next(error);
//     }
// }
export const createCompany = async (request, response, next) => {
    try {
        let data = request.body;
        let {
            // A Starts
            companyname, companyremark, companyaddress, companystate, companydistrict, companypin, companyaddressremark, companytype, companytyperemark, companycategory, companycategoryremark, companynatureofbusiness, companynatureofbusinessremark,

            // B Starts
            companyregistration, companyregistrationremark, companycin, companycinremark, companyissuedplace, companyissuedplaceremark, companyauthority, companyauthorityremark, companyregistrationdate, companypan, companypanremark, companytan, companytanremark, companytin, companytinremark, companygst, companygstremark, RegistrationB1, RegistrationB2, RegistrationB3,

            // C Starts
            ClientcontactC1, ClientcontactC2, ClientcontactC3, ClientcontactC4,

            // D Starts
            pfnumber, pfdremark, doc, pfaddress, pfstate, pfdistrict, pfpin, OtherRegsitrationD1PFsubcodes, OtherRegsitrationD1ESIsubcodes, OtherRegsitrationD3NSP, OtherRegsitrationD3FL, OtherRegsitrationD3OTP, OtherRegsitrationD3WOE, OtherRegsitrationD3TD, OtherRegsitrationD3MSME, OtherRegsitrationD3BOCW, OtherRegsitrationD3IMW, esinumber, esidremark, esidoc, esiaddress, esistate, esidistrict, esipin, esiaddressremark, registrationD3, registrationD3remark, doregistrationD3, doeregistrationD3, doddrregistrationD3, managernameD3, managernameD3remark, noeD3, noemD3, noefD3, issueauthfD3, issueauthfD3remark, fpD3, fpD3remark, doapp, issueauthfpD3, issueauthfpD3remark, powerfpD3, powerfpD3remark, powerhpfpD3, powerhpfpD3remark, registrationlwfD3, registrationlwfD3remark, doregistrationlwfD3, registrationptrD3, registrationptrD3remark, doregistrationptrD3,

            // E Starts 
            contLabRegNoE, contLabRegNoERemark, dateOfRegistrationE, dateOfRegERemark, noOfContractEmployeesE, noOfContractEmpERemark, noOfContractorsE, noOfContractorsERemark, nameOfContractorE1, nameOfContractorsE1Remark, nameOfEstablishmentE1, nameOfEstablishmentE1Remark, regAddContractorE1, regStateContractorE1, regDistContractorE1, regPinContractorE1, regAddContractorE1Remark, agreementExpiryDateE2, agreementExpiryDateE2Remark, agreementRenewalDateE2, agreementRenewalDateE2Remark, natureOfWorkAgreementE2, natureOfWorkAgreementE2Remark, noOfEmpDeployedAgreementE2, noOfEmpDeployedAgreementE2Remark, companyTypeLabourE3, companyTypeLabourE3Remark, contractLabourLicNoE3, contractLabourLicNoE3Remark, contractLicDateE3, contractLicDateE3Remark, contractExpiryDateE3, contractExpiryDateE3Remark, contractRenewalDueDateE3, contractRenewalDueDateE3Remark, noOfWorkersContractE3, noOfWorkersContractE3Remark, panContractorsE3, panContractorsE3Remark, gstContractorsE3, gstContractorsE3Remark, pfRegContractorsE3, pfRegContractorsE3Remark, esicRegContractorsE3, esicRegContractorsE3Remark, shopsandEstContractorsE3, shopsandEstContractorsE3Remark, lwfRegContractorsE3, lwfRegContractorsE3Remark, profTaxContractorsE3, profTaxContractorsE3Remark,

            // F Starts
            contractorAddBranchF, contractorStateBranchF, contractorDistBranchF, contractorPinBranchF, branchOpeningDateF, contractorAddBranchFRemark, noOfEmpBranchF, managerNameF1, managerNameF1Remark, managerMobNoF1, managerMobNoF1Remark, managerEmailF1, managerEmailF1Remark, managerAadharNoF1, managerAadharNoF1Remark, managerPanF1, managerPanF1Remark, shopsEstLicenseF2, shopsEstLicenseF2Remark, contractLabRegNoF5, contractLabRegNoF5Remark, regDateContractorF5, coOfContractEmpF5, noOfContractorsF5, contractorNameF51, contractorNameF51Remark, establishmentNameF51, establishmentNameF51Remark, regAddContractorF51, regStateContractorF51, regDistContractorF51, regPinContractorF51, regAddContractorF51Remark, expiryDateF52, renewalDateF52, natureOfWorkF52, natureOfWorkF52Remark, noOfEmpDeployedF52, companyTypeF53, companyTypeF53Remark, contractLabLicNoF53, contractLabLicNoF53Remark, licenseDateF53, expiryDateF53, renewalDateF53, noOfWorkerF53, panF53, panF53Remark, gstF53, gstF53Remark, pfRegF53, pfRegF53Remark, esicRegF53, esicRegF53Remark, shopsEstF53, shopsEstF53Remark, lwfRegF53, lwfRegF53Remark, profTaxF53, profTaxF53Remark, F1branch, F1RLicense, F1FL, F1FP, F54NSP, F54OTP, F54WOE, F54TL,

            // G Starts
            g12ncw, g12ncwremark, g12ncwdate, g12ncwdatevalid, g12ncwnow, g12ncwcoe, g12ncwcoeremark, g13form, g13formremark, g13form5date, g13form5dateofcommence, g13form5licenece, g13form5liceneceremark, g13form5licensedol, g13form5licensedolvalid, g13form5licensedoldor, g13form5licenseworkers, g13form5licensemanresp, g13form5licensefee, g13form5licensefeeremark, g13form5securityfee, g13form5securityfeeremark, g14dcwc, g14dncc, g14dars, g14dls, GCC4TL,
            created_at

        } = data
        // pfnumber, pfaddressimage
        let company, newCompany;
        const uploadImage = async (imageFile) => {
            let imageUrl
            if (!imageFile) {
                return null; // Return null if image is not provided
            }
            const url = request.protocol + '://' + request.get('host');
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
            if (imageFile.mimetype === 'image/jpeg' || imageFile.mimetype === 'image/jpg' || imageFile.mimetype === 'image/png') {
                const formattedImageFileName = Date.now() + '-' + imageFile.originalname.split(' ').join('-');
                imageUrl = url + '/' + imageDirectory + formattedImageFileName;
                const imagePath = uploadsDirectory + imageDirectory + formattedImageFileName;
                await sharp(imageFile.buffer).resize({ width: 600 }).toFile(imagePath);
            }

            if (imageFile.mimetype === 'application/pdf') {
                const formattedDocumentFileName = Date.now() + imageFile.originalname.split(' ').join('-');
                imageUrl = url + '/' + documentDirectory + formattedDocumentFileName;
                fs.writeFileSync(uploadsDirectory + documentDirectory + formattedDocumentFileName, imageFile.buffer);
            }
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

        if (F1branch !== undefined && F1branch.length > 0) {
            dataF1branch = await Promise.all(F1branch.map(async (item, index) => {
                return {
                    ...item,
                    image: await uploadImage(request.files.find(img => img.fieldname === `F1branch[${index}][image]`))
                }
            }))
        }
        if (F1RLicense !== undefined && F1RLicense.length > 0) {
            dataF1RLicense = await Promise.all(F1RLicense.map(async (item, index) => {
                return {
                    ...item,
                    managerlicenseimage: await uploadImage(request.files.find(img => img.fieldname === `F1RLicense[${index}][managerlicenseimage]`)),
                    issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `F1RLicense[${index}][issuingauthimage]`))
                }
            }))
        }
        if (F1FL !== undefined && F1FL.length > 0) {
            dataF1FL = await Promise.all(F1FL.map(async (item, index) => {
                return {
                    ...item,
                    managerlicenseimage: await uploadImage(request.files.find(img => img.fieldname === `F1FL[${index}][managerlicenseimage]`)),
                    issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `F1FL[${index}][issuingauthimage]`))
                }
            }))
        }
        if (F1FP !== undefined && F1FP.length > 0) {
            dataF1FP = await Promise.all(F1FP.map(async (item, index) => {
                return {
                    ...item,
                    issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `F1FP[${index}][issuingauthimage]`))
                }
            }))
        }
        if (F54NSP !== undefined && F54NSP.length > 0) {
            dataF54NSP = await Promise.all(F54NSP.map(async (item, index) => {
                return {
                    ...item,
                    issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `F54NSP[${index}][issuingauthimage]`))
                }
            }))
        }
        if (F54OTP !== undefined && F54OTP.length > 0) {
            dataF54OTP = await Promise.all(F54OTP.map(async (item, index) => {
                return {
                    ...item,
                    issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `F54OTP[${index}][issuingauthimage]`))
                }
            }))
        }
        if (F54WOE !== undefined && F54WOE.length > 0) {
            dataF54WOE = await Promise.all(F54WOE.map(async (item, index) => {
                return {
                    ...item,
                    issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `F54WOE[${index}][issuingauthimage]`))
                }
            }))
        }
        if (F54TL !== undefined && F54TL.length > 0) {
            dataF54TL = await Promise.all(F54TL.map(async (item, index) => {
                return {
                    ...item,
                    issuingauthimage: await uploadImage(request.files.find(img => img.fieldname === `F54TL[${index}][issuingauthimage]`))
                }
            }))
        }
        // ***********************-------- G Dynamic Image Handling ----------***********************
        let dataGCC4TL
        if (GCC4TL !== undefined && GCC4TL.length > 0) {
            dataGCC4TL = await Promise.all(GCC4TL.map(async (item, index) => {
                return {
                    ...item,
                    clientimage: await uploadImage(request.files.find(img => img.fieldname === `GCC4TL[${index}][clientimage]`)),
                    clientaddressimage: await uploadImage(request.files.find(img => img.fieldname === `GCC4TL[${index}][clientaddressimage]`))
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
                companyname, companyremark, companyaddress, companystate, companydistrict, companypin, companyaddressremark, companytype, companytyperemark, companycategory, companycategoryremark, companynatureofbusiness, companynatureofbusinessremark,
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
                companygstimage: await uploadImage(request.files.find(img => img.fieldname === "companygstimage")), companyregistration, companyregistrationremark, companycin, companycinremark, companyissuedplace, companyissuedplaceremark, companyauthority, companyauthorityremark, companyregistrationdate, companypan, companypanremark, companytan, companytanremark, companytin, companytinremark, companygst, companygstremark,
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
                registrationptrD3image: await uploadImage(request.files.find(img => img.fieldname === "registrationptrD3image")), pfnumber, pfdremark, doc, pfaddress, pfstate, pfdistrict, pfpin, esinumber, esidremark, esidoc, esiaddress, esistate, esidistrict, esipin, esiaddressremark, registrationD3, registrationD3remark, doregistrationD3, doeregistrationD3, doddrregistrationD3, managernameD3, managernameD3remark, noeD3, noemD3, noefD3, issueauthfD3, issueauthfD3remark, fpD3, fpD3remark, doapp, issueauthfpD3, issueauthfpD3remark, powerfpD3, powerfpD3remark, powerhpfpD3, powerhpfpD3remark, registrationlwfD3, registrationlwfD3remark, doregistrationlwfD3, registrationptrD3, registrationptrD3remark, doregistrationptrD3,
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
        if ((contLabRegNoE && dateOfRegistrationE && noOfContractEmployeesE && noOfContractorsE && regAddContractorE1 && regStateContractorE1 && regDistContractorE1 && regPinContractorE1 && nameOfContractorE1 && nameOfEstablishmentE1 && agreementExpiryDateE2 && agreementRenewalDateE2 && natureOfWorkAgreementE2 && panContractorsE3 && gstContractorsE3 && pfRegContractorsE3 && esicRegContractorsE3 && shopsandEstContractorsE3 && lwfRegContractorsE3 && profTaxContractorsE3 && companyTypeLabourE3) || (noOfEmpDeployedAgreementE2 && contractLabourLicNoE3 && contractLicDateE3 && contractExpiryDateE3 && contractRenewalDueDateE3 && noOfWorkersContractE3)) {
            ///E starts
            company = {
                // isEngagedFile: await uploadImage(request.files.find(img => img.fieldname === "isEngagedFile")),
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
                contLabRegNoE, contLabRegNoERemark, dateOfRegistrationE, dateOfRegERemark, noOfContractEmployeesE, noOfContractEmpERemark, noOfContractorsE, noOfContractorsERemark, nameOfContractorE1, nameOfContractorsE1Remark, nameOfEstablishmentE1, nameOfEstablishmentE1Remark, regAddContractorE1, regStateContractorE1, regDistContractorE1, regPinContractorE1, regAddContractorE1Remark, agreementExpiryDateE2, agreementExpiryDateE2Remark, agreementRenewalDateE2, agreementRenewalDateE2Remark, natureOfWorkAgreementE2, natureOfWorkAgreementE2Remark, noOfEmpDeployedAgreementE2, noOfEmpDeployedAgreementE2Remark, companyTypeLabourE3, companyTypeLabourE3Remark, contractLabourLicNoE3, contractLabourLicNoE3Remark, contractLicDateE3, contractLicDateE3Remark, contractExpiryDateE3, contractExpiryDateE3Remark, contractRenewalDueDateE3, contractRenewalDueDateE3Remark, noOfWorkersContractE3, noOfWorkersContractE3Remark, panContractorsE3, panContractorsE3Remark, gstContractorsE3, gstContractorsE3Remark, pfRegContractorsE3, pfRegContractorsE3Remark, esicRegContractorsE3, esicRegContractorsE3Remark, shopsandEstContractorsE3, shopsandEstContractorsE3Remark, lwfRegContractorsE3, lwfRegContractorsE3Remark, profTaxContractorsE3, profTaxContractorsE3Remark,

            }
        }
        // /* F Starts */
        if (contractorAddBranchF && contractorStateBranchF && contractorDistBranchF && contractorPinBranchF && branchOpeningDateF && noOfEmpBranchF && managerNameF1 && managerMobNoF1 && managerEmailF1 && managerAadharNoF1 && managerPanF1 && shopsEstLicenseF2 && regDateContractorF5 && noOfContractorsF5 && contractorNameF51 && establishmentNameF51 && regAddContractorF51 && regStateContractorF51 && regDistContractorF51 && regPinContractorF51 && expiryDateF52 && renewalDateF52 && natureOfWorkF52 && noOfEmpDeployedF52 && companyTypeF53 && contractLabLicNoF53 && licenseDateF53 && expiryDateF53 && renewalDateF53 && noOfWorkerF53 && panF53 && gstF53 && pfRegF53 && esicRegF53 && shopsEstF53 && lwfRegF53 && profTaxF53) {

            company = {
                managerNameF1File: await uploadImage(request.files.find(img => img.fieldname === "managerNameF1File")),
                managerMobNoF1File: await uploadImage(request.files.find(img => img.fieldname === "managerMobNoF1File")),
                managerEmailF1File: await uploadImage(request.files.find(img => img.fieldname === "managerEmailF1File")),
                managerAadharNoF1File: await uploadImage(request.files.find(img => img.fieldname === "managerAadharNoF1File")),
                managerPanF1File: await uploadImage(request.files.find(img => img.fieldname === "managerPanF1File")),
                shopsEstLicenseF2File: await uploadImage(request.files.find(img => img.fieldname === "shopsEstLicenseF2File")),
                numberF2File: await uploadImage(request.files.find(img => img.fieldname === "numberF2File")),
                regDateF2File: await uploadImage(request.files.find(img => img.fieldname === "expiryDateF2File")),
                expiryDateF2File: await uploadImage(request.files.find(img => img.fieldname === "expiryDateF2File")),
                renewalDateF2File: await uploadImage(request.files.find(img => img.fieldname === "renewalDateF2File")),
                managerNameF2File: await uploadImage(request.files.find(img => img.fieldname === "managerNameF2File")),
                noOfEmployeesF2File: await uploadImage(request.files.find(img => img.fieldname === "noOfEmployeesF2File")),
                maleF2File: await uploadImage(request.files.find(img => img.fieldname === "maleF2File")),
                issuingAuthorityF2File: await uploadImage(request.files.find(img => img.fieldname === "issuingAuthorityF2File")),
                numberF3File: await uploadImage(request.files.find(img => img.fieldname === "numberF3File")),
                regDateF3File: await uploadImage(request.files.find(img => img.fieldname === "regDateF3File")),
                expiryDateF3File: await uploadImage(request.files.find(img => img.fieldname === "expiryDateF3File")),
                renewalDateF3File: await uploadImage(request.files.find(img => img.fieldname === "renewalDateF3File")),
                managerNameF3File: await uploadImage(request.files.find(img => img.fieldname === "managerNameF3File")),
                noOfEmployeesF3File: await uploadImage(request.files.find(img => img.fieldname === "noOfEmployeesF3File")),
                maleF3File: await uploadImage(request.files.find(img => img.fieldname === "maleF3File")),
                issuingAuthorityF3File: await uploadImage(request.files.find(img => img.fieldname === "issuingAuthorityF3File")),
                numberF4File: await uploadImage(request.files.find(img => img.fieldname === "numberF4File")),
                regDateF4File: await uploadImage(request.files.find(img => img.fieldname === "regDateF4File")),
                issuingAuthorityF4File: await uploadImage(request.files.find(img => img.fieldname === "issuingAuthorityF4File")),
                numberF5File: await uploadImage(request.files.find(img => img.fieldname === "numberF5File")),
                regDateF5File: await uploadImage(request.files.find(img => img.fieldname === "regDateF5File")),
                issuingAuthorityF5File: await uploadImage(request.files.find(img => img.fieldname === "issuingAuthorityF5File")),
                contractLabRegNoF5File: await uploadImage(request.files.find(img => img.fieldname === "contractLabRegNoF5File")),
                regDateContractorF5File: await uploadImage(request.files.find(img => img.fieldname === "regDateContractorF5File")),
                noOfContractEmpF5File: await uploadImage(request.files.find(img => img.fieldname === "noOfContractEmpF5File")),
                noOfContractorsF5File: await uploadImage(request.files.find(img => img.fieldname === "noOfContractorsF5File")),
                contractorNameF51File: await uploadImage(request.files.find(img => img.fieldname === "contractorNameF51File")),
                establishmentNameF51File: await uploadImage(request.files.find(img => img.fieldname === "establishmentNameF51File")),
                regAddContractorF51File: await uploadImage(request.files.find(img => img.fieldname === "regAddContractorF51File")),
                expiryDateF52File: await uploadImage(request.files.find(img => img.fieldname === "expiryDateF52File")),
                renewalDateF52File: await uploadImage(request.files.find(img => img.fieldname === "renewalDateF52File")),
                natureOfWorkF52File: await uploadImage(request.files.find(img => img.fieldname === "natureOfWorkF52File")),
                noOfEmpDeployedF52File: await uploadImage(request.files.find(img => img.fieldname === "noOfEmpDeployedF52File")),
                companyTypeF53File: await uploadImage(request.files.find(img => img.fieldname === "companyTypeF53File")),
                contractLabLicNoF53File: await uploadImage(request.files.find(img => img.fieldname === "contractLabLicNoF53File")),
                licenseDateF53File: await uploadImage(request.files.find(img => img.fieldname === "licenseDateF53File")),
                expiryDateF53File: await uploadImage(request.files.find(img => img.fieldname === "expiryDateF53File")),
                renewalDateF53File: await uploadImage(request.files.find(img => img.fieldname === "renewalDateF53File")),
                noOfWorkerF53File: await uploadImage(request.files.find(img => img.fieldname === "noOfWorkerF53File")),
                panF53File: await uploadImage(request.files.find(img => img.fieldname === "gstF53File")),
                gstF53File: await uploadImage(request.files.find(img => img.fieldname === "gstF53File")),
                pfRegF53File: await uploadImage(request.files.find(img => img.fieldname === "pfRegF53File")),
                esicRegF53File: await uploadImage(request.files.find(img => img.fieldname === "esicRegF53File")),
                shopsEstF53File: await uploadImage(request.files.find(img => img.fieldname === "shopsEstF53File")),
                lwfRegF53File: await uploadImage(request.files.find(img => img.fieldname === "lwfRegF53File")),
                profTaxF53File: await uploadImage(request.files.find(img => img.fieldname === "profTaxF53File")),
                number54File: await uploadImage(request.files.find(img => img.fieldname === "number54File")),
                regDate54File: await uploadImage(request.files.find(img => img.fieldname === "regDate54File")),
                expiryDate54File: await uploadImage(request.files.find(img => img.fieldname === "expiryDate54File")),
                renewalDate54File: await uploadImage(request.files.find(img => img.fieldname === "renewalDate54File")),
                issuingAuthority54File: await uploadImage(request.files.find(img => img.fieldname === "issuingAuthority54File")),
                number55File: await uploadImage(request.files.find(img => img.fieldname === "number55File")),
                regDate55File: await uploadImage(request.files.find(img => img.fieldname === "regDate55File")),
                expiryDate55File: await uploadImage(request.files.find(img => img.fieldname === "expiryDate55File")),
                renewalDate55File: await uploadImage(request.files.find(img => img.fieldname === "renewalDate55File")),
                issuingAuthoritye55File: await uploadImage(request.files.find(img => img.fieldname === "issuingAuthoritye55File")),
                number56File: await uploadImage(request.files.find(img => img.fieldname === "number56File")),
                regDate56File: await uploadImage(request.files.find(img => img.fieldname === "regDate56File")),
                expiryDate56File: await uploadImage(request.files.find(img => img.fieldname === "expiryDate56File")),
                renewalDate56File: await uploadImage(request.files.find(img => img.fieldname === "renewalDate56File")),
                issuingAuthority56File: await uploadImage(request.files.find(img => img.fieldname === "issuingAuthority56File")),
                number57File: await uploadImage(request.files.find(img => img.fieldname === "number57File")),
                regDate57File: await uploadImage(request.files.find(img => img.fieldname === "regDate57File")),
                expiryDate57File: await uploadImage(request.files.find(img => img.fieldname === "expiryDate57File")),
                renewalDate57File: await uploadImage(request.files.find(img => img.fieldname === "renewalDate57File")),
                issuingAuthority57File: await uploadImage(request.files.find(img => img.fieldname === "issuingAuthority57File")), regAddContractorF51, regStateContractorF51, regDistContractorF51, regPinContractorF51, contractorAddBranchFRemark, branchOpeningDateF, noOfEmpBranchF, managerNameF1, managerNameF1Remark, managerMobNoF1, managerMobNoF1Remark, managerEmailF1, managerEmailF1Remark, managerAadharNoF1, managerAadharNoF1Remark, managerPanF1, managerPanF1Remark, shopsEstLicenseF2, shopsEstLicenseF2Remark, contractLabRegNoF5, contractLabRegNoF5Remark, regDateContractorF5, coOfContractEmpF5, noOfContractorsF5, contractorNameF51, contractorNameF51Remark, establishmentNameF51, establishmentNameF51Remark, regAddContractorF51Remark, expiryDateF52, renewalDateF52, natureOfWorkF52, natureOfWorkF52Remark, noOfEmpDeployedF52, companyTypeF53, companyTypeF53Remark, contractLabLicNoF53, contractLabLicNoF53Remark, licenseDateF53, expiryDateF53, renewalDateF53, noOfWorkerF53, panF53, panF53Remark, gstF53, gstF53Remark, pfRegF53, pfRegF53Remark, esicRegF53, esicRegF53Remark, shopsEstF53, shopsEstF53Remark, lwfRegF53, lwfRegF53Remark, profTaxF53, profTaxF53Remark,
                F1branch: dataF1branch,
                F1RLicense: dataF1RLicense,
                F1FL: dataF1FL,
                F1FP: dataF1FP,
                F54NSP: dataF54NSP,
                F54OTP: dataF54OTP,
                F54WOE: dataF54WOE,
                F54TL: dataF54TL

            }
        }
        // G Starts
        if (g12ncw && g12ncwdate && g12ncwdatevalid && g12ncwnow && g12ncwcoe && g13form && g13form5date && g13form5dateofcommence && g13form5licenece && g13form5licensedol && g13form5licensedolvalid && g13form5licensedoldor && g13form5licenseworkers && g13form5licensemanresp && g13form5licensefee && g13form5securityfee && g14dcwc && g14dncc && g14dars && g14dls) {
            company = {
                g12ncwimage: await uploadImage(request.files.find(img => img.fieldname === "g12ncwimage")),
                g12ncwcoeimage: await uploadImage(request.files.find(img => img.fieldname === "g12ncwcoeimage")),
                g13formimage: await uploadImage(request.files.find(img => img.fieldname === "g13formimage")),
                g13form5liceneceimage: await uploadImage(request.files.find(img => img.fieldname === "g13form5liceneceimage")),
                g13form5licensefeeimage: await uploadImage(request.files.find(img => img.fieldname === "g13form5licensefeeimage")),
                g13form5securityfeeimage: await uploadImage(request.files.find(img => img.fieldname === "g13form5securityfeeimage")),
                g12ncw, g12ncwremark, g12ncwdate, g12ncwdatevalid, g12ncwnow, g12ncwcoe, g12ncwcoeremark, g13form, g13formremark, g13form5date, g13form5dateofcommence, g13form5licenece, g13form5liceneceremark, g13form5licensedol, g13form5licensedolvalid, g13form5licensedoldor, g13form5licenseworkers, g13form5licensemanresp, g13form5licensefee, g13form5licensefeeremark, g13form5securityfee, g13form5securityfeeremark, g14dcwc, g14dncc, g14dars, g14dls, created_at,
                GCC4TL: dataGCC4TL
            }
        }
        // Save company data to database
        // const newCompany = new Companys(company);
        // await newCompany.save();
        newCompany = await Companydata.findOneAndUpdate({ _id: lastInsertedIdcompany }, company, { new: true })
        response.status(201).json(newCompany);
    } catch (error) {
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

export const gettingCompanyTable = async (request, response, next) => {
    try {
        const company = await Companydata.aggregate([
            {
                $match: {}
            },


            // {
            //     $lookup: {
            //         from: "companies",
            //         localField: "company",
            //         foreignField: "_id",
            //         as: "companyData"
            //     },
            // },
            // {
            //     $lookup: {
            //         from: "users",
            //         localField: "executive",
            //         foreignField: "_id",
            //         as: "executiveData"
            //     },
            // },
            {
                $lookup: {
                    from: "states",
                    localField: "companystate",
                    foreignField: "_id",
                    as: "stateData"
                },
            },
            // {
            //     $lookup: {
            //         from: "branches",
            //         localField: "branch",
            //         foreignField: "_id",
            //         as: "branchData"
            //     }
            // },
            // {
            //     $unwind: "$F1branch",
            // },
            // {
            //     $group: {
            //         _id: "$id",
            //         noOfF1branch: {
            //             $sum: 1,
            //         },
            //     },
            // },
            {
                $project: {
                    _id: 1,

                    // A Starts
                    created_at: 1,
                    profile: 1,
                    reason: 1,
                    approveDate: 1,
                    rejected_at: 1,
                    license: 1,
                    receivedDate: 1,
                    compIntractStatus: 1,
                    inactiveDate: 1,
                    companyname: 1,

                    // companystate: 1,
                    // companydistrict: 1,
                    // companytype: 1,
                    // companytyperemark: 1,
                    // companycategory: 1,

                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    // company: { $arrayElemAt: ["$companyData.companyname", 0] },
                    // branch: { $arrayElemAt: ["$branchData.name", 0] },
                    updated_at: 1,
                }
            }
        ])
        const branchData = await Companydata.aggregate(
            [
                // Unwind the branch array
                { $unwind: "$F1branch" },
                // Group by branch name and count the occurrences
                {
                    $group: {
                        _id: "$F1branch.name",
                        totalCount: { $sum: 1 }
                    }
                },
                // Project to rename fields and include totalCount for each document
                {
                    $project: {
                        branchName: "$_id",
                        totalCount: 1,
                        _id: 0
                    }
                },
                // Group again to count total branches for each document
                {
                    $group: {
                        _id: null,
                        branches: { $push: { branchName: "$branchName", totalCount: "$totalCount" } },
                        totalBranches: { $sum: "$totalCount" }
                    }
                },
                // Optionally, project to reshape the output if needed
                {
                    $project: {
                        _id: 0,
                        branches: 1,
                        totalBranches: 1

                    }
                }
            ]
        )
        response.status(201).json(branchData)
    }
    catch (error) {
        next(error)
    }
}


export const gettingCompanyById = async (request, response, next) => {
    try {
        const companyId = request.params.id
        console.log(companyId);
        const company = await Companydata.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(companyId)
                }
            },
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

                    // A Starts

                    companyname: 1,
                    companydetails: 1,
                    companyremark: 1,
                    companyaddress: 1,
                    companystate: 1,
                    companydistrict: 1,
                    companypin: 1,
                    companyaddressremark: 1,
                    companytype: 1,
                    companytyperemark: 1,
                    companycategory: 1,
                    companycategoryremark: 1,
                    companynatureofbusiness: 1,
                    companynatureofbusinessremark: 1,

                    // B Starts

                    companyregistration: 1,
                    companyregistrationremark: 1,
                    companycin: 1,
                    companycinremark: 1,
                    companyissuedplace: 1,
                    companyissuedplaceremark: 1,
                    companyauthority: 1,
                    companyauthorityremark: 1,
                    companyregistrationdate: 1,
                    companypan: 1,
                    companypanremark: 1,
                    companytan: 1,
                    companytanremark: 1,
                    companytin: 1,
                    companytinremark: 1,
                    companygst: 1,
                    companygstremark: 1,
                    RegistrationB1: 1,
                    RegistrationB2: 1,
                    RegistrationB3: 1,

                    // C Starts

                    ClientcontactC1: 1,
                    ClientcontactC2: 1,
                    ClientcontactC3: 1,
                    ClientcontactC4: 1,

                    // D Starts

                    pfnumber: 1,
                    pfdremark: 1,
                    doc: 1,
                    pfaddress: 1,
                    pfstate: 1,
                    pfdistrict: 1,
                    pfpin: 1,
                    OtherRegsitrationD1PFsubcodes: 1,
                    OtherRegsitrationD1ESIsubcodes: 1,
                    OtherRegsitrationD3NSP: 1,
                    OtherRegsitrationD3FL: 1,
                    OtherRegsitrationD3OTP: 1,
                    OtherRegsitrationD3WOE: 1,
                    OtherRegsitrationD3TD: 1,
                    OtherRegsitrationD3MSME: 1,
                    OtherRegsitrationD3BOCW: 1,
                    OtherRegsitrationD3IMW: 1,
                    esinumber: 1,
                    esidremark: 1,
                    esidoc: 1,
                    esiaddress: 1,
                    esistate: 1,
                    esidistrict: 1,
                    esipin: 1,
                    esiaddressremark: 1,
                    registrationD3: 1,
                    registrationD3remark: 1,
                    doregistrationD3: 1,
                    doeregistrationD3: 1,
                    doddrregistrationD3: 1,
                    managernameD3: 1,
                    managernameD3remark: 1,
                    noeD3: 1,
                    noemD3: 1,
                    noefD3: 1,
                    issueauthfD3: 1,
                    issueauthfD3remark: 1,
                    fpD3: 1,
                    fpD3remark: 1,
                    doapp: 1,
                    issueauthfpD3: 1,
                    issueauthfpD3remark: 1,
                    powerfpD3: 1,
                    powerfpD3remark: 1,
                    powerhpfpD3: 1,
                    powerhpfpD3remark: 1,
                    registrationlwfD3: 1,
                    registrationlwfD3remark: 1,
                    doregistrationlwfD3: 1,
                    registrationptrD3: 1,
                    registrationptrD3remark: 1,
                    doregistrationptrD3: 1,

                    // E Starts 

                    contLabRegNoE: 1,
                    contLabRegNoERemark: 1,
                    dateOfRegistrationE: 1,
                    dateOfRegERemark: 1,
                    noOfContractEmployeesE: 1,
                    noOfContractEmpERemark: 1,
                    noOfContractorsE: 1,
                    noOfContractorsERemark: 1,
                    nameOfContractorE1: 1,
                    nameOfContractorsE1Remark: 1,
                    nameOfEstablishmentE1: 1,
                    nameOfEstablishmentE1Remark: 1,
                    regAddContractorE1: 1,
                    regStateContractorE1: 1,
                    regDistContractorE1: 1,
                    regPinContractorE1: 1,
                    regAddContractorE1Remark: 1,
                    agreementExpiryDateE2: 1,
                    agreementExpiryDateE2Remark: 1,
                    agreementRenewalDateE2: 1,
                    agreementRenewalDateE2Remark: 1,
                    natureOfWorkAgreementE2: 1,
                    natureOfWorkAgreementE2Remark: 1,
                    noOfEmpDeployedAgreementE2: 1,
                    noOfEmpDeployedAgreementE2Remark: 1,
                    companyTypeLabourE3: 1,
                    companyTypeLabourE3Remark: 1,
                    contractLabourLicNoE3: 1,
                    contractLabourLicNoE3Remark: 1,
                    contractLicDateE3: 1,
                    contractLicDateE3Remark: 1,
                    contractExpiryDateE3: 1,
                    contractExpiryDateE3Remark: 1,
                    contractRenewalDueDateE3: 1,
                    contractRenewalDueDateE3Remark: 1,
                    noOfWorkersContractE3: 1,
                    noOfWorkersContractE3Remark: 1,
                    panContractorsE3: 1,
                    panContractorsE3Remark: 1,
                    gstContractorsE3: 1,
                    gstContractorsE3Remark: 1,
                    pfRegContractorsE3: 1,
                    pfRegContractorsE3Remark: 1,
                    esicRegContractorsE3: 1,
                    esicRegContractorsE3Remark: 1,
                    shopsandEstContractorsE3: 1,
                    shopsandEstContractorsE3Remark: 1,
                    lwfRegContractorsE3: 1,
                    lwfRegContractorsE3Remark: 1,
                    profTaxContractorsE3: 1,
                    profTaxContractorsE3Remark: 1,

                    // F Starts

                    contractorAddBranchF: 1,
                    contractorStateBranchF: 1,
                    contractorDistBranchF: 1,
                    contractorPinBranchF: 1,
                    branchOpeningDateF: 1,
                    contractorAddBranchFRemark: 1,
                    noOfEmpBranchF: 1,
                    managerNameF1: 1,
                    managerNameF1Remark: 1,
                    managerMobNoF1: 1,
                    managerMobNoF1Remark: 1,
                    managerEmailF1: 1,
                    managerEmailF1Remark: 1,
                    managerAadharNoF1: 1,
                    managerAadharNoF1Remark: 1,
                    managerPanF1: 1,
                    managerPanF1Remark: 1,
                    shopsEstLicenseF2: 1,
                    shopsEstLicenseF2Remark: 1,
                    contractLabRegNoF5: 1,
                    contractLabRegNoF5Remark: 1,
                    regDateContractorF5: 1,
                    coOfContractEmpF5: 1,
                    noOfContractorsF5: 1,
                    contractorNameF51: 1,
                    contractorNameF51Remark: 1,
                    establishmentNameF51: 1,
                    establishmentNameF51Remark: 1,
                    regAddContractorF51: 1,
                    regStateContractorF51: 1,
                    regDistContractorF51: 1,
                    regPinContractorF51: 1,
                    regAddContractorF51Remark: 1,
                    expiryDateF52: 1,
                    renewalDateF52: 1,
                    natureOfWorkF52: 1,
                    natureOfWorkF52Remark: 1,
                    noOfEmpDeployedF52: 1,
                    companyTypeF53: 1,
                    companyTypeF53Remark: 1,
                    contractLabLicNoF53: 1,
                    contractLabLicNoF53Remark: 1,
                    licenseDateF53: 1,
                    expiryDateF53: 1,
                    renewalDateF53: 1,
                    noOfWorkerF53: 1,
                    panF53: 1,
                    panF53Remark: 1,
                    gstF53: 1,
                    gstF53Remark: 1,
                    pfRegF53: 1,
                    pfRegF53Remark: 1,
                    esicRegF53: 1,
                    esicRegF53Remark: 1,
                    shopsEstF53: 1,
                    shopsEstF53Remark: 1,
                    lwfRegF53: 1,
                    lwfRegF53Remark: 1,
                    profTaxF53: 1,
                    profTaxF53Remark: 1,
                    F1branch: 1,
                    F1RLicense: 1,
                    F1FL: 1,
                    F1FP: 1,
                    F54NSP: 1,
                    F54OTP: 1,
                    F54WOE: 1,
                    F54TL: 1,

                    // G Starts

                    g12ncw: 1,
                    g12ncwremark: 1,
                    g12ncwdate: 1,
                    g12ncwdatevalid: 1,
                    g12ncwnow: 1,
                    g12ncwcoe: 1,
                    g12ncwcoeremark: 1,
                    g13form: 1,
                    g13formremark: 1,
                    g13form5date: 1,
                    g13form5dateofcommence: 1,
                    g13form5licenece: 1,
                    g13form5liceneceremark: 1,
                    g13form5licensedol: 1,
                    g13form5licensedolvalid: 1,
                    g13form5licensedoldor: 1,
                    g13form5licenseworkers: 1,
                    g13form5licensemanresp: 1,
                    g13form5licensefee: 1,
                    g13form5licensefeeremark: 1,
                    g13form5securityfee: 1,
                    g13form5securityfeeremark: 1,
                    g14dcwc: 1,
                    g14dncc: 1,
                    g14dars: 1,
                    g14dls: 1,
                    GCC4TL: 1,
                    created_at: 1,
                    // Files
                    companyimage: 1,
                    companyaddressimage: 1,
                    companytypeimage: 1,
                    companycategoryimage: 1,
                    companynatureofbusinessimage: 1,

                    companyregistrationimage: 1,
                    companyciniamge: 1,
                    companyissuedplaceimage: 1,
                    companyauthorityimage: 1,
                    companypanimage: 1,
                    companytanimage: 1,
                    companytinimage: 1,
                    companygstimage: 1,

                    pfimage: 1,
                    pfaddressimage: 1,
                    esiimage: 1,
                    esiaddressimage: 1,
                    registrationD3image: 1,
                    managernameD3image: 1,
                    issueauthfD3image: 1,
                    fpD3image: 1,
                    issueauthfpD3image: 1,
                    powerfpD3image: 1,
                    powerhpfpD3image: 1,
                    registrationlwfD3image: 1,
                    registrationptrD3image: 1,

                    contLabRegNoEFile: 1,
                    dateOfRegEFile: 1,
                    noOfContractEmpEFile: 1,
                    noOfContractorsEFile: 1,
                    nameOfContractorsE1File: 1,
                    nameOfEstablishmentE1File: 1,
                    regAddContractorE1File: 1,
                    agreementExpiryDateE2File: 1,
                    agreementRenewalDateE2DetFile: 1,
                    natureOfWorkAgreementE2File: 1,
                    noOfEmpDeployedAgreementE2File: 1,
                    companyTypeLabourE3File: 1,
                    contractLabourLicNoE3File: 1,
                    contractLicDateE3File: 1,
                    contractExpiryDateE3File: 1,
                    contractRenewalDueDateE3File: 1,
                    noOfWorkersContractE3File: 1,
                    panContractorsE3File: 1,
                    gstContractorsE3File: 1,
                    pfRegContractorsE3File: 1,
                    esicRegContractorsE3File: 1,
                    shopsandEstContractorsE3File: 1,
                    lwfRegContractorsE3File: 1,
                    profTaxContractorsE3File: 1,

                    managerNameF1File: 1,
                    managerMobNoF1File: 1,
                    managerEmailF1File: 1,
                    managerAadharNoF1File: 1,
                    managerPanF1File: 1,
                    shopsEstLicenseF2File: 1,
                    numberF2File: 1,
                    regDateF2File: 1,
                    expiryDateF2File: 1,
                    renewalDateF2File: 1,
                    managerNameF2File: 1,
                    noOfEmployeesF2File: 1,
                    maleF2File: 1,
                    issuingAuthorityF2File: 1,
                    numberF3File: 1,
                    regDateF3File: 1,
                    expiryDateF3File: 1,
                    renewalDateF3File: 1,
                    managerNameF3File: 1,
                    noOfEmployeesF3File: 1,
                    maleF3File: 1,
                    issuingAuthorityF3File: 1,
                    numberF4File: 1,
                    regDateF4File: 1,
                    issuingAuthorityF4File: 1,
                    numberF5File: 1,
                    regDateF5File: 1,
                    issuingAuthorityF5File: 1,
                    contractLabRegNoF5File: 1,
                    regDateContractorF5File: 1,
                    noOfContractEmpF5File: 1,
                    noOfContractorsF5File: 1,
                    contractorNameF51File: 1,
                    establishmentNameF51File: 1,
                    regAddContractorF51File: 1,
                    expiryDateF52File: 1,
                    renewalDateF52File: 1,
                    natureOfWorkF52File: 1,
                    noOfEmpDeployedF52File: 1,
                    companyTypeF53File: 1,
                    contractLabLicNoF53File: 1,
                    licenseDateF53File: 1,
                    expiryDateF53File: 1,
                    renewalDateF53File: 1,
                    noOfWorkerF53File: 1,
                    panF53File: 1,
                    gstF53File: 1,
                    pfRegF53File: 1,
                    esicRegF53File: 1,
                    shopsEstF53File: 1,
                    lwfRegF53File: 1,
                    profTaxF53File: 1,
                    number54File: 1,
                    regDate54File: 1,
                    expiryDate54File: 1,
                    renewalDate54File: 1,
                    issuingAuthority54File: 1,
                    number55File: 1,
                    regDate55File: 1,
                    expiryDate55File: 1,
                    renewalDate55File: 1,
                    issuingAuthoritye55File: 1,
                    number56File: 1,
                    regDate56File: 1,
                    expiryDate56File: 1,
                    renewalDate56File: 1,
                    issuingAuthority56File: 1,
                    number57File: 1,
                    regDate57File: 1,
                    expiryDate57File: 1,
                    renewalDate57File: 1,
                    issuingAuthority57File: 1,

                    g12ncwimage: 1,
                    g12ncwcoeimage: 1,
                    g13formimage: 1,
                    g13form5liceneceimage: 1,
                    g13form5licensefeeimage: 1,
                    g13form5securityfeeimage: 1,
                    executive: {
                        $concat: [
                            { $arrayElemAt: ["$executiveData.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$executiveData.lastName", 0] }
                        ]
                    },
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    company: { $arrayElemAt: ["$companyData.companyname", 0] },
                    branch: { $arrayElemAt: ["$branchData.name", 0] },
                    createdAt: 1,
                    updatedAt: 1,
                }
            }

        ])
        response.status(201).json(company)
    }
    catch (error) {
        next(error)
    }
}



