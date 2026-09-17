const router = require("express").Router();
const auth = require("../middlewares/auth");
const { 
    getWishlist, 
    addToWishlist, 
    removeFromWishlist 
} = require("../controllers/wishlist.controller");

router.use(auth);

router.route("/")
    .get(getWishlist)
    .post(addToWishlist);

router.delete("/:productId", removeFromWishlist);

module.exports = router;