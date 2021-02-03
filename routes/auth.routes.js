const router = require('express').Router()

const authController = require("../app/controllers/auth/auth.controller");

router.post('/signin', authController.signIn)
router.post('/token', authController.refreshToken)

module.exports = router