const router = require("express").Router();
const auth = require("../middlewares/auth");
const restrictTo = require("../middlewares/restrictTo");
const {
    getAllProducts,
    getOneProduct,
    addProduct,
    updateProduct,
    hideProduct,
    restoreProduct,
    getHiddenProducts,
    filterProducts,
    deleteProduct,
    createProductReview
} = require("../controllers/product.controller");

router.route("/")
    .get(getAllProducts)
    .post(auth, restrictTo("admin"), addProduct);

router.route("/filter")
    .get(filterProducts);

router.route("/hidden")
    .get(auth, restrictTo("admin"), getHiddenProducts);

router.route("/hide/:id")
    .patch(auth, restrictTo("admin"), hideProduct);

router.route("/restore/:id")
    .patch(auth, restrictTo("admin"), restoreProduct);

router.route("/:id/reviews")
    .post(auth, createProductReview);

router.route("/:id")
    .get(getOneProduct)
    .put(auth, restrictTo("admin"), updateProduct)
    .delete(auth, restrictTo("admin"), deleteProduct);

module.exports = router;