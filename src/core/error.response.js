'use strict'

const { ReasonPhrases } = require("../utils/httpStatuseCode")
const statusCodes = require("../utils/statusCodes")

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

 const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error'
 }

class ErrorResponse extends Error{
    constructor(message, status)
    {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse{
    constructor( message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT){
        super(message, statusCode)
    }
}
class BadRequestError extends ErrorResponse{
    constructor( message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN){
        super(message, statusCode)
    }
}


class AuthFailureError extends ErrorResponse{
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCode.UNAUTHORIZED){
        super(message, statusCodes)
    }
}


module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError
}