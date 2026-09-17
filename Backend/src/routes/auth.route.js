const router = require("express").Router();
const auth = require("../middlewares/auth");

const { 
    signup, 
    confirmEmail, 
    login, 
    forgetPassword, 
    resetPassword,
    updateMeasurements,
    getProfile,
    updateProfileDetails
} = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/confirm-email", confirmEmail);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/profile", auth, getProfile);
router.patch("/update-measurements", auth, updateMeasurements);
router.patch("/update-profile", auth, updateProfileDetails);

module.exports = router;