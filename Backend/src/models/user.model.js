const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        select: false
    },
    phoneNumber: {
        type: String
    },
    phone: {
        type: String
    },
    image: {
        type: String
    },
    address: {
        type: String,
        default: "Giza Governorate, Egypt"
    },
    measurements: {
        bust: { type: String, default: "84 cm" },
        waist: { type: String, default: "66 cm" },
        highHip: { type: String, default: "92 cm" },
        stature: { type: String, default: "175 cm" }
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isActive: {
        type: Boolean,
        default: false
    },
    confirmOTP: {
        type: String,
        select: false
    },
    OTPExpire: {
        type: Date,
        select: false
    },
    membership: {
        type: String,
        enum: ["Standard", "Salon Prime", "VIP Gold"],
        default: "Standard"
    },
    membershipExpiresAt: {
        type: Date,
        default: null
    },
    stripeCustomerId: {
        type: String,
        default: null
    },
    subscriptionId: {
        type: String,
        default: null
    },
    resetToken: {
        type: String,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;