const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError(404, "User not found"));
    }
    res.status(200).json({
        success: true,
        data: user
    });
});

exports.upgradeMembership = catchAsync(async (req, res, next) => {
    const { plan } = req.body;
    
    if (!["Salon Prime", "VIP Gold"].includes(plan)) {
        return next(new AppError(400, "Invalid membership plan selected"));
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            membership: plan,
            membershipExpiresAt: expiryDate
        },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: `Successfully subscribed to ${plan}!`,
        data: updatedUser
    });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        totalUsers: users.length,
        data: users
    });
});

exports.getOneUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError(404, "User not found"));
    res.status(200).json({
        success: true,
        data: user
    });
});