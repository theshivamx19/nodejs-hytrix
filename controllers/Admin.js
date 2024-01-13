import axios from 'axios';
import Admin from '../models/Admin.js';
import Category from '../models/Category.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const emailRgx = /^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/
const salt = 10


const AdminReg = async (req, res) => {
    try {
        const data = req.body;
        data.image = req.file.path
        console.log(req.file);
        // console.log(data.image);
        if (!req.file) {
            res.status(400).json("file is required")
        }

        if (Object.keys(data).length === 0) {
            res.status(400).json("Data is required to register user")
        }
        let { name, email, mobile, password, status, userType, image } = data
        if (!name) {
            res.status(400).json("Name is required")
        }
        if (!email) {
            res.status(400).json("Email is required")
        }
        if (!emailRgx.test(email)) {
            res.status(400).json("Enter valid email id")
        }
        if (!password) {
            res.status(400).json("Password is required")
        }
        if (!mobile) {
            res.status(400).json("Mobile no. is required")
        }
        if (password) {
            const encryptedPass = await bcrypt.hash(password, salt)
            data['password'] = encryptedPass
        }
        console.log(data);
        await Admin.create(data)
        return res.status(201).json("Admin created successfully!!")
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const Login = async (req, res) => {
    try {
        const data = req.body
        const { email, password } = data
        if (Object.keys(data).length === 0) {
            res.status(400).json("Data is required to login user")
        }
        if (!email) {
            res.status(400).json("User id is required")
        }
        if (!emailRgx.test(email)) {
            res.status(400).json("Enter valid email id")
        }
        if (!password) {
            res.status(400).json("Password id is required")
        }
        const checkAdmin = await Admin.findOne({ email })

        if (!checkAdmin) {
            res.status(404).json("Invalid credentials/Admin not found")
        }
        const decryptedPass = checkAdmin.password
        const pass = await bcrypt.compare(password, decryptedPass)
        if (!pass) {
            res.status(400).json("Password is incorrect")
        }
        const token = jwt.sign({
            userId: checkAdmin._id
        }, 'secretKey')
        console.log(token);
        res.cookie('x-api-key', token)
        res.status(200).json("Admin logged in successfully!!")
    }
    catch (err) {
        res.status(500).json({ mesage: err.message })
    }
}

const CreateCategory = async (req, res) => {
    try {
        const data = req.body
        if (Object.keys(data).length === 0) {
            res.status(400).json("Data is required to create category")
        }
        const { name, created_at, updated_at } = data
        if(!name){
            res.status(400).json("Category name is required")
        }
        const category = await Category.create(data);
        res.status(201).json("Category created successfully!!")
    }
    catch(err){
        res.status(500).json({message :err.mesage})
    }
}

const Compliance = async (req, res)=>{
    try {
        const data = req.body
        if (Object.keys(data).length === 0) {
            res.status(400).json("Data is required to create category")
        }
        const {state, act, rule, category, questiondesc, form, docattachment, compliancetype, recurrence, duedate, url, executiveId, status, created_at, updated_at} = data
        if(!state){
            res.status(400).json("State name is required")
        }
        if(!act){
            res.status(400).json("Act is required")
        }
        if(!rule){
            res.status(400).json("Rule is required")
        }
        if(!category){
            res.status(400).json("Category name is required")
        }
        if(!questiondesc){
            res.status(400).json("Question desc name is required")
        }
        if(!form){
            res.status(400).json("Form name is required")
        }
        if(!docattachment){
            res.status(400).json("Doc attachement is required")
        }
        if(!compliancetype){
            res.status(400).json("Compliance type is required")
        }
        if(!recurrence){
            res.status(400).json("Recurrence is required")
        }
        // if(!duedate){
        //     res.status(400).json("Category name is required")
        // }
        if(!url){
            res.status(400).json("Url is required")
        }
        // if(!executiveId){
        //     res.status(400).json("Executive Id is required")
        // }
        if(!status){
            res.status(400).json("Category name is required")
        }
        await Compliance.create(data)
        res.status(201).json("Compliance created")
    }
    catch(err){
        res.status(500).json({message : err.message})
    }
}



export default { AdminReg, Login, CreateCategory, jsonApi };