import jwt from 'jsonwebtoken'

const authentication = async (req, res, next) => {
    try {
        const token = req.cookies['x-api-key']
        if (!token) {
            return res.status(400).send({ status: false, message: "Token must be present" })
        }
        await jwt.verify(token, 'secretKey', (err, decodedToken) => {
            if (err) {
                return res.status(401).send({ status: false, message: "User is unauthenticated" })
            }
            req.tokenUserId = decodedToken.userId
            next()
        })
    }
    catch (err) {
        return res.status(500).send({status : false, message : err.message})
    }
}

export default { authentication }