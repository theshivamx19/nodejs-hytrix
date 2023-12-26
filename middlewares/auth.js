const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

const authentication = (req, res, next) => {
    const token = req.headers['x-api-key']
    if (!token) {
        return res.status(400).send({ status: false, message: "token must be present" })
    }
    jwt.verify(token, "SecretKey", (err, decodedToken) => {
        if (err) {
            return res.status(401).send({ status: false, message: "User is unauthenticated" })
        }
        req.decodedToken = decodedToken.userId
        // console.log(decodedToken.userId);
        next()
    })
}

const authorization = (req, res, next) => {
    const tokenUserId = req.decodedToken
    const paramsUserId = req.params.id
    console.log(tokenUserId, paramsUserId);
    if (tokenUserId !== paramsUserId) {
        return res.status(403).send({ status: false, message: "Unauthorized user" })
    }
    next()
}

module.exports = { authentication, authorization }