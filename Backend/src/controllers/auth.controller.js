const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/sendEmail");
const template = require("../utils/emailTemplate");


const signToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id, user.role);
    user.password = undefined;
    res.status(statusCode).json({
        success: true,
        token,
        data: { user }
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password, phoneNumber, role } = req.body;
    if (!name || !email || !password) {
        return next(new AppError(400, "Please provide name, email and password."));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError(400, "Email already in use."));
    }
    
    const confirmOTP = String(Math.floor(100000 + Math.random() * 900000));
    const newUser = await User.create({
        name,
        email,
        password,
        phoneNumber,
        role: role || "user",
        isActive: false,
        confirmOTP: await bcrypt.hash(confirmOTP, Number(process.env.SALT_ROUND) || 12),
        OTPExpire: new Date(Date.now() + 10 * 60 * 1000)
    });

    try {
        await sendEmail(email, "Confirm your MODEVA Account", template(confirmOTP, name, "Email Confirmation Code"));
    } catch (err) {
        console.error("Email sending failed:", err.message);
    }

    res.status(201).json({
        success: true,
        message: "Account created. Please check your email for the confirmation code."
    });
});

exports.confirmEmail = catchAsync(async (req, res, next) => {
    const { email, confirmOTP } = req.body;
    const user = await User.findOne({ email }).select("+confirmOTP +OTPExpire");
    if (!user) return next(new AppError(400, "User not found"));
    if (user.isActive) return next(new AppError(400, "This email is already active"));
    const check = await bcrypt.compare(confirmOTP, user.confirmOTP);
    if (!check || user.OTPExpire < Date.now()) {
        return next(new AppError(400, "Invalid or expired OTP"));
    }
    user.isActive = true;
    user.confirmOTP = undefined;
    user.OTPExpire = undefined;
    await user.save();
    createSendToken(user, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError(400, "Please provide email and password."));
    }
    const user = await User.findOne({ email }).select("+password +role");
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError(401, "Incorrect email or password."));
    }
    if (!user.isActive) {
        return next(new AppError(401, "This account is inactive. Please verify email first."));
    }
    createSendToken(user, 200, res);
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new AppError(404, "User not found"));
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    await user.save();
    const link = `http://localhost:3000/reset-password/${resetToken}`;
    try {
        await sendEmail(email, "Reset Password Link", template(link, user.name, "Reset Link"));
    } catch (err) {}
    res.status(200).json({
        success: true,
        message: "Reset link sent to email"
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    if (!token) return next(new AppError(400, "Reset token is required"));
    if (!password || password.length < 6) {
        return next(new AppError(400, "Password must be 6 characters or more"));
    }
    const user = await User.findOne({ resetToken: token });
    if (!user) return next(new AppError(400, "Reset token is invalid or expired"));
    user.password = password;
    user.resetToken = undefined;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
});


exports.updateMeasurements = catchAsync(async (req, res, next) => {
    const { measurements } = req.body;
    if (!measurements) {
        return next(new AppError(400, "Please provide measurements data."));
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { measurements },
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        return next(new AppError(404, "User not found."));
    }

    res.status(200).json({
        success: true,
        message: "Measurements updated successfully",
        data: {
            measurements: updatedUser.measurements
        }
    });
});
exports.getProfile = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError(404, "User not found"));
    }
    res.status(200).json({
        success: true,
        data: { user }
    });
});
exports.updateProfileDetails = async (req, res, next) => {
    try {
        const { name, phone, address } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone, address },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Profile and shipping address updated successfully",
            data: { user: updatedUser }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};