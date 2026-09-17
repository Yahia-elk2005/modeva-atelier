const mongoose = require("mongoose");
const wishlistSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    wishlistItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true
        },
        name: String,
        price: Number,
        image: String
    }]
}, {
    timestamps: true,
    versionKey: false
});
const Wishlist = mongoose.model("wishlist", wishlistSchema);
module.exports = Wishlist;