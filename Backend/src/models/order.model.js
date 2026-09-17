const mongoose = require("mongoose");
require("./user.model");

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            },
            name: String,
            price: Number,
            quantity: Number,
            size: String
        }
    ],
    total: {
        type: String,
        required: true
    },
    shippingAddress: {
        type: String,
        default: "Giza Governorate"
    },
    shippingCost: {
        type: Number,
        default: 25
    },
    paymentMethod: {
        type: String,
        enum: ["CARD", "COD"],
        default: "CARD"
    },
    status: {
        type: String,
        default: "In Progress"
    },
    alterationRequested: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

const Orders = mongoose.model("order", orderSchema);
module.exports = Orders;