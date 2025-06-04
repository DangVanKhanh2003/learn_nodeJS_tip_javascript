'use strict'

const express = require('express')
const accessController = require('../../controller/access.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const router = express.Router()

//handel error


//signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))

//login
router.post('/shop/login', asyncHandler(accessController.login
))

module.exports = router