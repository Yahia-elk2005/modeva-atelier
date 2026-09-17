const AppError = require("../utils/AppError");

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(400, message);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : 'value';
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(400, message);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(400, message);
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || err.status || 500;
    err.status = err.status || 'error';

    
    console.error("ERROR 💥:", err);

    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    
    res.status(error.statusCode || 500).json({
        success: false,
        status: error.status,
        message: error.message || 'Something went wrong!',
        error: error,
        stack: error.stack
    });
};