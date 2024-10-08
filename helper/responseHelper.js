exports.sendSuccess = (res, data = {}, message = '', statusCode = 200) => {
    res.status(statusCode).json({
        status: true,
        data: data,
        message: message
    })
}

exports.sendError = (res, data = {}, message = '', statusCode = 400) => {
    res.status(statusCode).json({
        status: false,
        data: data,
        message: message
    })
}