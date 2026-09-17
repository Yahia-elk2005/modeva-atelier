const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    discountValue: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    minOrder: {
        type: Number,
        default: 0
    },
    expiryDate: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: "Active Privileges"
    }
}, {
    timestamps: true,
    versionKey: false
});

const Voucher = mongoose.model("Voucher", voucherSchema);

module.exports = Voucher;