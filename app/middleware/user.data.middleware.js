const User = require('../models/user.model')

class UserDataMiddleware {
    checkUsername = (req, res, next) => {
        User.findOne({
            username: req.body.username
        }).exec((err, user) => {
            if (err)
                return res.status(500).send({ message: err })

            if (user)
                return res.status(200).send({ status: false, message: "Username already exist, please use another username" })

            next()    
        })
    }
}
module.exports = new UserDataMiddleware()

