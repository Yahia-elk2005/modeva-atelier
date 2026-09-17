const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, "Name must be at least 3 characters"],
        maxLength: [50, "Name must be below 50 characters"]
    },
    price: {
        type: Number,
        required: true,
        min: [1, "Price must be a positive number"]
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, "Quantity cannot be negative"],
        default: 10
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 5.0
    },
    reviews: [reviewSchema],
    numReviews: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: "Haute couture bespoke garment crafted at Senopati Atelier."
    },
    isDeleted: {
        type: String,
        enum: ['LIVE', 'DRAFT'],
        default: 'LIVE',
        select: false
    },
    deletedAt: {
        type: Date,
        select: false
    },
    onSale: {
        type: Boolean,
        default: false
    },
    discountPrice: {
        type: Number
    },
    isNewArrival: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

const Products = mongoose.model("product", productSchema);

module.exports = Products;