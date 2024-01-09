import jwt from 'jsonwebtoken'

const authentication = async (req, res, next) => {
    const token = req.cookies['x-api-key']
    if (!token) {
        return res.status(400).send({ status: false, message: "Token must be present" })
    }
    await jwt.verify(token, 'secretKey', (err, decodedToken) => {
        if (err) {
            return res.status(501).send({ status: false, message: "User is unauthenticated" })
        }
        req.tokenUserId = decodedToken.userId
        next()
    })
}

export default { authentication }