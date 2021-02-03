const authConfig = require("../../../config/auth.config")
const User = require("../../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const tokenList = {}

class AuthController {
    signIn = async (req, res) => {
        let {username,password} = req.body

        if (!username || !password)
            return res.status(404).send({message: "Invalid Request"})

        try {
            let user = await User.findOne({
                username: req.body.username,
            }).exec()

            if (!user)
                return res.status(401).send({message: "User not found"})

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            )

            if (!passwordIsValid) 
                return res.status(401).send({message: "Incorrect password"})
            
            const data = {
                id: user._id,
                role: user.role
            }
            const token = jwt.sign(data, authConfig.secret, {expiresIn: authConfig.secret_expire})
            const refreshToken = jwt.sign(data, authConfig.secret_refresh, {expiresIn: authConfig.secret_refresh_expire})

            const response = {
                token: token,
                refresh_token: refreshToken,
            }

            tokenList[refreshToken] = response
            res.status(200).send(response)

        } catch (err) {
            if (err)
                return res.status(500).send({message: err})
        }
    }

    refreshToken = (req, res) => {
        if(!req.body.refreshToken || !req.body.refreshToken in tokenList) 
            return res.status(404).send({message: 'Invalid request'})

        const token = jwt.sign({id: req.userId, role: req.userRole}, authConfig.secret, {expiresIn: authConfig.secret_expire})
        if(!tokenList[req.body.refreshToken])
            return res.status(401).send({message: 'Invalid refresh token'})

        tokenList[req.body.refreshToken].token = token

        return res.status(200).json({token: token});        
    }
}

module.exports = new AuthController()