const Voucher = require("../models/voucher.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getAllVouchers = catchAsync(async (req, res, next) => {
    const vouchers = await Voucher.find();
    res.status(200).json({
        success: true,
        data: vouchers
    });
});

exports.createVoucher = catchAsync(async (req, res, next) => {
    const { code, title, discountValue, description, minOrder, expiryDate, category } = req.body;
    
    if (!code || !title || !discountValue || !description || !expiryDate) {
        return next(new AppError(400, "Please provide all required voucher fields"));
    }

    const newVoucher = await Voucher.create(req.body);
    res.status(201).json({
        success: true,
        message: "Voucher created successfully by Admin",
        data: newVoucher
    });
});

exports.deleteVoucher = catchAsync(async (req, res, next) => {
    const voucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!voucher) return next(new AppError(404, "Voucher not found"));
    
    res.status(200).json({
        success: true,
        message: "Voucher deleted successfully"
    });
});

exports.applyVoucher = catchAsync(async (req, res, next) => {
    const { code, cartTotal } = req.body;
    
    if (!code) {
        return next(new AppError(400, "Please provide a promo code"));
    }

    const voucher = await Voucher.findOne({ code: code.toUpperCase() });
    
    if (!voucher) {
        return next(new AppError(404, "Invalid or expired privilege pass"));
    }

    const total = Number(cartTotal) || 0;
    if (total < voucher.minOrder) {
        return next(new AppError(400, `Minimum order amount for this pass is $${voucher.minOrder}`));
    }

    let discountAmount = 0;
    if (voucher.discountValue.includes("%")) {
        const percent = parseFloat(voucher.discountValue);
        discountAmount = (total * percent) / 100;
    } else {
        discountAmount = parseFloat(voucher.discountValue);
    }

    res.status(200).json({
        success: true,
        message: `Pass "${voucher.code}" applied successfully!`,
        discountAmount,
        voucher
    });
});