import Admin from '../models/Admin.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const emailRgx = /^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/
const salt = 10


const adminRegistration = async (req, res) => {
    try {
        const data = req.body;
        data.image = req.file.path

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "Data is required to register user" })
        }
        let { name, email, mobile, password, status, userType, image } = data
        if (!name) {
            return res.status(400).send({ status: false, message: "Name is required" })
        }
        if (!email) {
            return res.status(400).send({ status: false, message: "Email is required" })
        }
        if(!emailRgx.test(email)){
            return res.status(400).send({ status: false, message: "Enter valid email id" })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: "Password is required" })
        }
        if (!mobile) {
            return res.status(400).send({ status: false, message: "Mobile no. is required" })
        }
        if (password) {
            const encryptedPass = await bcrypt.hash(password, salt)
            data['password'] = encryptedPass
        }
        const createAdmin = await Admin.create(data)
        return res.status(201).send({ status: true, message: "Admin created successfully", data: createAdmin })
    }
    catch (err) {
        return res.status(500).send({ status: false, messager: err.message })
    }
}

const login = async (req, res) => {
    try {
        const data = req.body
        const { email, password } = data
        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "Data is required to login user" })
        }
        if (!email) {
            return res.status(400).send({ status: false, message: "User id is required" })
        }
        if(!emailRgx.test(email)){
            return res.status(400).send({ status: false, message: "Enter valid email id" })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: "Password id is required" })
        }
        const checkAdmin = await Admin.findOne({ email })
        if (!checkAdmin) {
            return res.status(404).send({ status: false, message: "Invalid credentials/Admin not found" })
        }
        const token = jwt.sign({
            userId: checkAdmin.email
        }, 'secretKey')
        console.log(token);
        res.cookie('x-api-key', token)
        return res.status(200).send({ status: true, message: "Admin logged in successfully" })
    }
    catch (err) {
        return res.status(500).send({ status: false, mesage: err.mesage })
    }
}

export default { adminRegistration, login };