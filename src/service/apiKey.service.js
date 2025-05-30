'use strict'

const apiKeyModel = require("../model/apiKey.model")
const crypto = require('crypto')
const findById = async (key) => {
    const objKey = await apiKeyModel.findOne({key, status: true}).lean()
    return objKey
}

module.exports = {
    findById
}