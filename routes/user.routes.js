const router = require('express').Router()

const userMiddleware = require('../app/middleware/auth/user.auth.middleware')
const userController = require('../app/controllers/user/user.controller')
const userDataMiddleware = require('../app/middleware/user.data.middleware')
const { ROLES } = require('../config/roles.config')

router.use(userMiddleware.verifyToken)

router.get('/', userController.index)

router.post(
    '/', 
    [
        userDataMiddleware.checkUsername,
        (req, res, next) => {
            console.log(req)
            userMiddleware.verifyRoles(req, res, next, ROLES.admin)
        }
    ], 
    userController.store
)

router.put(
        '/:id', 
        [
            userDataMiddleware.checkUsername,
            (req, res, next) => {
                userMiddleware.verifyRoles(req, res, next, ROLES.admin)
            }
        ], 
        userController.update
)

router.delete(
    '/:id', 
    [
        (req, res, next) => {
            userMiddleware.verifyRoles(req, res, next, ROLES.admin)
        }
    ], 
    userController.delete
)

module.exports = router