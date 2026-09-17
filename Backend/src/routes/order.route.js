const router = require("express").Router();
const auth = require("../middlewares/auth");
const restrictTo = require("../middlewares/restrictTo");
const { 
    getAllOrders, 
    getOneOrder, 
    getUserOrders, 
    addOrder, 
    shipOrder, 
    requestAlteration, 
    deleteOrder 
} = require("../controllers/order.controller");

router.use(auth);

router.get("/my-orders", getUserOrders);
router.patch("/alteration/:id", requestAlteration);

router.route("/")
    .get(restrictTo("admin"), getAllOrders)
    .post(addOrder);

router.route("/:id")
    .get(getOneOrder)
    .patch(restrictTo("admin"), shipOrder)
    .delete(deleteOrder);

module.exports = router;