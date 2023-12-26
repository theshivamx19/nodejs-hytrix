const { isValidObjectId } = require('mongoose');
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {
        // const {fname, lname, email, phone, password, address} = req.body
        // const {shipping, billing} = address
        // const {street, city, pincode} = shipping
        // const {street, city, pincode} = billing
        const data = req.body
        console.log(data);
        // if(!data){
        //     return res.status(400).send({status : false, message : "Data is required to register user"})
        // }
        // if(!fname){
        //     return res.status(400).send({status : false, message : "Data is required to register user"})
        // }
        const user = await userModel.create(data)
        return res.status(201).send({ status: true, message: "User registered successfully", data: user })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: 'Enter valid user id' })
        }
        const checkUser = await userModel.findOne({ _id: userId })
        if (!checkUser) {
            return res.status(404).send({ status: false, message: "No such user exists" })
        }
        return res.status(200).send({ status: true, message: 'User details', data: checkUser })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const checkUser = await userModel.findOne({ email, password })
        if (!checkUser) {
            return res.status(404).send({ status: false, messgae: "No such user exists" })
        }
        const token = jwt.sign({
            userId: checkUser._id.toString()
        }, "SecretKey")

        res.setHeader('x-api-key', token)
        return res.status(200).send({ status: true, message: "User logged in successful", data: token })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: 'Enter valid user id' })
        }
        const checkUser = await userModel.findOne({ _id: userId })
        if (!checkUser) {
            return res.status(404).send({ status: false, message: "No such user exists" })
        }
        let newUser = req.body
        const updatedUser = await userModel.findByIdAndUpdate({_id : userId}, {$set : newUser}, {new : true})
        return res.status(200).send({ status: true, message: 'User updated successfully', data: updateUser })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}

module.exports = { register, login, getUser, updateUser}