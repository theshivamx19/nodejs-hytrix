import Admin from '../models/Admin.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const salt = 10


const adminRegistration = async (req, res) => {
    try {
        const data = req.body;
        let hashedPass;
        console.log(data);
        let { password } = data
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
        if(!email){
            return res.status(400).send({ status: false, message: "User id is required" })
        }
        if(!password){
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

const imageUpload = async (req, res)=>{
    const image = req.image;
    console.log(image);
}


export default { adminRegistration, login, imageUpload };