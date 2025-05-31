'use strict'

const express = require('express')
const accessController = require('../../controller/access.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const router = express.Router()

//handel error


//signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))

module.exports = router