const Product = require("../models/product.model");
const ApiFeatures = require("../utils/ApiFeatures");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getAllProducts = catchAsync(async (req, res, next) => {
    let filter = { isDeleted: { $ne: 'DRAFT' } };
    
    if (req.query.category) {
        const cat = req.query.category.toLowerCase();
        if (cat === 'casual') {
            filter.category = { $regex: 'casual', $options: 'i' };
        } else {
            filter.category = new RegExp(cat, 'i');
        }
    }
    if (req.query.search) {
        filter.name = { $regex: req.query.search, $options: 'i' };
    }
    
    const products = await Product.find(filter);
    res.status(200).json({
        success: true,
        data: products
    });
});

exports.getOneProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError(404, "Product not found"));
    res.status(200).json({
        success: true,
        data: product
    });
});

exports.addProduct = catchAsync(async (req, res, next) => {
    const { name, price, category, quantity, image } = req.body;
    if (!name || !price || !category || quantity === undefined || !image) {
        return next(new AppError(400, "Please provide all required fields"));
    }
    const newProduct = await Product.create(req.body);
    res.status(201).json({
        success: true,
        message: "Product added successfully",
        data: newProduct
    });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
    const updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!updateProduct) return next(new AppError(404, "Product not found"));
    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updateProduct
    });
});

exports.hideProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { isDeleted: 'DRAFT', deletedAt: new Date() },
        { new: true }
    );
    if (!product) return next(new AppError(404, "Product not found"));
    res.status(200).json({
        success: true,
        message: "Product hidden successfully",
        data: product
    });
});

exports.restoreProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { isDeleted: 'LIVE', deletedAt: null },
        { new: true }
    );
    if (!product) return next(new AppError(404, "Product not found"));
    res.status(200).json({
        success: true,
        message: "Product restored successfully",
        data: product
    });
});

exports.getHiddenProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find({ isDeleted: 'DRAFT' }).select("+isDeleted +deletedAt");
    res.status(200).json({
        success: true,
        totalProducts: products.length,
        data: products
    });
});

exports.filterProducts = catchAsync(async (req, res, next) => {
    const filter = { isDeleted: 'LIVE' };
    if (req.query.category) {
        filter.category = req.query.category;
    }
    const products = await Product.find(filter);
    res.status(200).json({
        success: true,
        totalProducts: products.length,
        data: products
    });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return next(new AppError(404, "Product not found"));
    res.status(200).json({
        success: true,
        message: "Product permanently deleted"
    });
});

exports.createProductReview = catchAsync(async (req, res, next) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new AppError(404, "Product not found"));
    }

    const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
        return next(new AppError(400, "You have already reviewed this product"));
    }

    const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({
        success: true,
        message: "Review added successfully",
        data: product
    });
});