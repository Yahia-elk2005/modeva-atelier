const Wishlist = require("../models/wishlist.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getWishlist = catchAsync(async (req, res, next) => {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("wishlistItems.product");
    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user._id, wishlistItems: [] });
    }
    res.status(200).json({
        success: true,
        data: wishlist
    });
});

exports.addToWishlist = catchAsync(async (req, res, next) => {
    const { productId, name, price, image } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: req.user._id,
            wishlistItems: [{ product: productId, name, price, image }]
        });
    } else {
        const exists = wishlist.wishlistItems.some(item => item.product.toString() === productId);
        if (!exists) {
            wishlist.wishlistItems.push({ product: productId, name, price, image });
            await wishlist.save();
        }
    }
    res.status(200).json({
        success: true,
        message: "Added to wishlist successfully",
        data: wishlist
    });
});

exports.removeFromWishlist = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
        return next(new AppError(404, "Wishlist not found"));
    }
    wishlist.wishlistItems = wishlist.wishlistItems.filter(item => item.product.toString() !== productId);
    await wishlist.save();
    res.status(200).json({
        success: true,
        message: "Removed from wishlist",
        data: wishlist
    });
});