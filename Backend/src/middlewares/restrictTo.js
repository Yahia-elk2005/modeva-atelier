const AppError = require("../utils/AppError");
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError(403, 'You do not have permission to perform this action.'));
        }
        next();
    };
};
module.exports = restrictTo;