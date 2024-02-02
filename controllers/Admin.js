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
import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';
import { response } from 'express';
import fs from 'node:fs'
import sharp from 'sharp';
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
        const category = await Category.find();
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
export const complianceCreate = async (request, response, next) => {
    try {
        const data = request.body
        const documentFile = request.file;
        const url = request.protocol + '://' + request.get('host');
        const formattedDocumentFileName = Date.now() + documentFile.originalname.split(' ').join('-');
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
        fs.writeFileSync(uploadsDirectory + documentDirectory + formattedDocumentFileName, documentFile.buffer);
        const documentUrl = url + '/' + documentDirectory + formattedDocumentFileName;


        const compliance = {
            state: data.state,
            act: data.act,
            rule: data.rule,
            category: data.category,
            questiondesc: data.questiondesc,
            form: data.form,
            docattachment: documentUrl,
            compliancetype: data.compliancetype,
            recurrence: data.recurrence,
            duedate: data.duedate,
            url: data.url,
            executiveId: data.executiveId,
            status: data.status,
        }
        const newCompliance = new Compliance(compliance);
        await newCompliance.save();
        response.status(201).json(newCompliance);
    } catch (error) {
        // response.status(404).json({ message: 'error.message' })
        next(error);
    }
}

export const complianceGetting = async (request, response, next) => {
    try {
        const compliance = await Compliance.find({}).populate("category")
        response.status(201).json(compliance)
    }
    catch (error) {
        next(error)
    }
}

// ----------------------User Creation ------------------>

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


// -----------------Create State ----------------

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

// ---------------Create CheckList-------------------

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
        const checklist = await CheckList.find({})
        response.status(201).json(checklist)
    }
    catch (error) {
        next(error)
    }
}


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
                documents : data.documents,
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


