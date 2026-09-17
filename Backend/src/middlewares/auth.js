const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const User = require("../models/user.model");
const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new AppError(401, 'Please login first to access this route.'));
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new AppError(401, 'The user belonging to this token no longer exists.'));
        }
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new AppError(401, 'Invalid token. Please log in again.'));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new AppError(401, 'Your token has expired. Please log in again.'));
        }
        return next(error);
    }
};
module.exports = auth;