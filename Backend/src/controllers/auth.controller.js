const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const { customAlphabet } = require("nanoid");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/sendEmail");
const template = require("../utils/emailTemplate");

const jwtSign = promisify(jwt.sign);

const generateOTP = () => {
    const otpGenerator = customAlphabet("0123456789", 6);
    return otpGenerator();
};

const createSendToken = async (user, statusCode, res) => {
    const token = await jwtSign(
        { id: user._id, role: user.role }, 
        process.env.SECRET_KEY, 
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    user.password = undefined;
    res.status(statusCode).json({
        success: true,
        token, 
        data: { user, accessToken: token }
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password, phoneNumber, role, image } = req.body;
    
    if (!name || !email || !password) {
        return next(new AppError(400, "Please provide name, email and password."));
    }

    const findUser = await User.findOne({ isDeleted: false, email });
    if (findUser) {
        return next(new AppError(400, "This email is already exist"));
    }
    
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, Number(process.env.SALT_ROUND) || 12);
    const OTPExpire = new Date(Date.now() + 10 * 60 * 1000);
    
    // تمرير الباسورد كما هي ليقوم الموديل بتشفيرها (يمنع التشفير المزدوج)
    const user = await User.create({
        name,
        email,
        password, 
        phoneNumber,
        image,
        role: role || "user",
        isActive: false,
        confirmOTP: hashedOTP,
        OTPExpire
    });

    try {
        await sendEmail(email, "Confirm your MODEVA Account", template(otp, name, "Email Confirmation Code"));
    } catch (err) {
        console.error("Email sending failed:", err.message);
    }

    res.status(201).json({
        success: true,
        message: "Account created. Please check your email for the confirmation code.",
        data: user
    });
});

exports.confirmEmail = catchAsync(async (req, res, next) => {
    const { email, confirmOTP } = req.body; 
    
    if (!email || !confirmOTP) {
        return next(new AppError(400, "Please provide email and verification code."));
    }

    const findUser = await User.findOne({ email }).select("+confirmOTP +OTPExpire");
    if (!findUser) return next(new AppError(400, "This email isn't exist please signup"));
    if (findUser.isActive) return next(new AppError(400, "This email is already active"));
    
    // التحقق الدقيق من الوقت
    if (!findUser.confirmOTP || !findUser.OTPExpire || new Date(findUser.OTPExpire).getTime() < Date.now()) {
        return next(new AppError(400, "Verification code has expired. Please request a new one."));
    }

    const check = await bcrypt.compare(confirmOTP, findUser.confirmOTP);
    if (!check) return next(new AppError(400, "Invalid verification code."));
    
    findUser.isActive = true; 
    findUser.confirmOTP = undefined; 
    findUser.OTPExpire = undefined; 
    await findUser.save();

    await createSendToken(findUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body; 
    
    if (!email || !password) {
        return next(new AppError(400, "Please provide email and password."));
    }

    const findUser = await User.findOne({ email, isDeleted: { $ne: true } }).select("+password +role +confirmOTP +OTPExpire");
    
    if (!findUser || !(await findUser.correctPassword(password, findUser.password))) {
        return next(new AppError(401, "Incorrect email or password."));
    }

    if (!findUser.isActive) {
        // توليد كود جديد في حال انتهاء الصلاحية أو عدم وجود كود مسبق
        if (!findUser.confirmOTP || !findUser.OTPExpire || new Date(findUser.OTPExpire).getTime() < Date.now()) {
            const otp = generateOTP();
            findUser.confirmOTP = await bcrypt.hash(otp, Number(process.env.SALT_ROUND) || 12);
            findUser.OTPExpire = new Date(Date.now() + 10 * 60 * 1000);
            await findUser.save({ validateBeforeSave: false });

            try {
                await sendEmail(email, "Confirm your MODEVA Account", template(otp, findUser.name, "Email Confirmation Code"));
            } catch (err) {
                console.error("Email sending failed:", err.message);
            }
        }

        return res.status(401).json({
            success: false,
            needsVerification: true,
            message: "This account is inactive. A verification code has been sent to your email."
        });
    }

    await createSendToken(findUser, 200, res);
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const findUser = await User.findOne({ email, isDeleted: { $ne: true } });
    if (!findUser) return next(new AppError(404, "This user is not found"));
    
    const resetToken = crypto.randomBytes(32).toString("hex");
    findUser.resetToken = resetToken;
    await findUser.save({ validateBeforeSave: false });
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const link = `${frontendUrl}/reset-password/${resetToken}`;
    
    try {
        await sendEmail(email, "Reset Password Link", template(link, findUser.name, "Reset Link"));
    } catch (err) {}
    
    res.status(200).json({
        success: true,
        message: "Reset link is sent to email"
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body; 
    
    if (!token) return next(new AppError(400, "Reset token is required"));
    if (!password || password.length < 6) return next(new AppError(400, "Password must be 6 char or more"));
    
    const findUser = await User.findOne({ resetToken: token }).select("+resetToken");
    if (!findUser) return next(new AppError(400, "The reset token is invalid or expired"));
    
    // التمرير المباشر لمنع التشفير المزدوج
    findUser.password = password; 
    findUser.resetToken = undefined; 
    await findUser.save();
    
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

    if (!updatedUser) return next(new AppError(404, "User not found."));

    res.status(200).json({
        success: true,
        message: "Measurements updated successfully",
        data: { measurements: updatedUser.measurements }
    });
});

exports.getProfile = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError(404, "User not found"));
    
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