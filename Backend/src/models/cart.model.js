const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    cartItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            type: Number,
            required: true
        },
        size: {
            type: String,
            default: "M"
        }
    }],
    totalCartPrice: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;