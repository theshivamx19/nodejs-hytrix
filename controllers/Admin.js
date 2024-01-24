import Admin from '../models/Admin.js';
import Category from '../models/Category.js';
import State from '../models/State.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';
import generateToken from '../utils/generateToken.js';
import Compliance from '../models/Compliances.js';
import { response } from 'express';
import User from '../models/User.js';
import CheckList from '../models/CheckList.js';

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
        const compliance = {
            state: data.state,
            act: data.act,
            rule: data.rule,
            category: data.category,
            questiondesc: data.questiondesc,
            form: data.form,
            docattachment: data.docattachment,
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
        const checklist = {
            state: data.state,
            act: data.act,
            rule: data.rule,
            category: data.category,
            status: data.status,
            form: data.form,
            document: data.document,
        }
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

export const checkListFilter = async (request, response, next) => {
    try {
        // const data = req.params
        const filter = await CheckList.aggregate[{
            $lookup : {
                from : "categories",
                localField : "category",
                foreignField : "_id",
                as : "dataresult"
            }
        }]
    response.status(201).json(filter)    
    }
    catch (error) {
        next(error)
    }
}

