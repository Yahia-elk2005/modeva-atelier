const router = require("express").Router();
const auth = require("../middlewares/auth");
const { 
    getLoggedUserCart, 
    addToCart, 
    removeFromCart 
} = require("../controllers/cart.controller");

router.use(auth);

router.route("/")
    .get(getLoggedUserCart)
    .post(addToCart);

router.delete("/:productId", removeFromCart);

module.exports = router;