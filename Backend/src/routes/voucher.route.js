const router = require("express").Router();
const { getAllVouchers, createVoucher, deleteVoucher, applyVoucher } = require("../controllers/voucher.controller");
const auth = require("../middlewares/auth");

router.get("/", getAllVouchers);
router.post("/apply", auth, applyVoucher);
router.post("/", auth, createVoucher);
router.delete("/:id", auth, deleteVoucher);

module.exports = router;