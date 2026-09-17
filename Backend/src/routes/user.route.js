const router = require("express").Router();
const auth = require("../middlewares/auth");
const restrictTo = require("../middlewares/restrictTo");
const { getMe, upgradeMembership, getAllUsers, getOneUser } = require("../controllers/user.controller");

router.use(auth);

router.get("/me", getMe);
router.patch("/upgrade-membership", upgradeMembership);

router.route("/")
    .get(restrictTo("admin"), getAllUsers);

router.route("/:id")
    .get(restrictTo("admin"), getOneUser);

module.exports = router;