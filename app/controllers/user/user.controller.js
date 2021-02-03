const User = require('../../models/user.model')
const {ROLES} = require('../../../config/roles.config')
var bcrypt = require("bcryptjs");
const { json } = require('body-parser');

class UserController {
    index = async (req, res) => {
        try {
            if(req.userRole === ROLES.admin)
                return User.find().then(users => {res.send(users)})

            return User.findById(req.userId).then(users => {res.send(users)})
        } catch (error) {
            res.status(500).send({message: 'Request invalid'})
        }
    }

    store = (req, res) => {

        let {username,password} = req.body

        if (!username || !password)
            return res.status(404).send({message: "Invalid Request"})

        const user = new User({
            username: username,
            password: bcrypt.hashSync(password, 8),
        })

        user.save(err => {
            if (err)
                return res.status(500).send({message: "Failed to store user"});

            return res.send({
                status: true,
                message: "Stored user success",
                data: user.toJSON()
            });
        });
    }

    update = async (req, res) => {
        let {username} = req.body

        if (!username || !req.params.id)
            return res.status(404).send({message: "Invalid Request"})
        try {
            const user = await User.findById(req.params.id)
            console.log(user)
            user.username = username
            await user.save()

            return res.send({
                status: true,
                message: "Update user success",
                data: user.toJSON()
            });
        } catch (error) {
            return res.status(500).send({message: "Failed to update user"});
        }
    }

    delete = async (req, res) => {
        if (!req.params.id)
            return res.status(404).send({message: "Invalid Request"})

        try {
            const user = await User.findById(req.params.id).remove()
            return res.send({
                status: true,
                message: "Delete user success"
            });
        } catch (error) {
            console.log(error)
            return res.status(500).send({message: "Failed to delete user"});
        }
    }
}

module.exports = new UserController()