const jwt = require('jsonwebtoken')
const authConfig = require('../../../config/auth.config')
const User = require('../../models/user.model')

class UserMiddleware {
    verifyToken = (req, res, next) => {
        let token = req.headers['x-access-token']
        if (!token)
            return res.status(403).send({ message: 'No token provided' })

        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if (err)
                return res.status(401).send({ message: 'Invalid token' })

            req.userId = decoded.id
            req.userRole = decoded.role
            next()
        })
    }

    verifyRoles = (req, res, next, roles) => {
        User.findById(req.userId).exec((err, user) => {
            if (err)
                return res.status(500).send({ message: err })

            if (!user)
                return res.status(401).send({ message: "User not found" })

            if (user.role !== roles)
                return res.status(404).send({ message: "Page not found" });
            next()
        })
    }
}

module.exports = new UserMiddleware();