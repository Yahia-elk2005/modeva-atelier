const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getLoggedUserCart = catchAsync(async (req, res, next) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate("cartItems.product");
    
    if (!cart) {
        cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $setOnInsert: { cartItems: [], totalCartPrice: 0 } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        ).populate("cartItems.product");
    }

    res.status(200).json({
        success: true,
        data: cart
    });
});

exports.addToCart = catchAsync(async (req, res, next) => {
    const { productId, quantity, size } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError(404, "Product not found"));
    }

    const selectedSize = size || "M";
    const qty = Number(quantity) || 1;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            cartItems: [{ product: productId, quantity: qty, price: product.price, size: selectedSize }]
        });
    } else {
        const itemIndex = cart.cartItems.findIndex(
            item => item.product.toString() === productId && item.size === selectedSize
        );
        if (itemIndex > -1) {
            cart.cartItems[itemIndex].quantity += qty;
        } else {
            cart.cartItems.push({ product: productId, quantity: qty, price: product.price, size: selectedSize });
        }
    }
    
    cart.totalCartPrice = cart.cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    await cart.save();
    
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate("cartItems.product");

    res.status(200).json({
        success: true,
        message: "Product added to cart successfully",
        data: populatedCart
    });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new AppError(404, "Cart not found"));
    }
    cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== productId);
    cart.totalCartPrice = cart.cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    await cart.save();
    
    cart = await Cart.findOne({ user: req.user._id }).populate("cartItems.product");

    res.status(200).json({
        success: true,
        message: "Product removed from cart",
        data: cart
    });
});