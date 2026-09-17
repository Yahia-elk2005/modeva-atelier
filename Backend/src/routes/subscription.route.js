const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createSubscriptionCheckout, stripeWebhook } = require("../controllers/subscription.controller");
const express = require("express");
const User = require("../models/user.model");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sendEmail = require("../utils/sendEmail");
const subscriptionTemplate = require("../utils/subscriptionEmailTemplate");

router.post("/create-checkout", auth, createSubscriptionCheckout);
router.post("/webhook", express.raw({ type: 'application/json' }), stripeWebhook);

router.get("/verify-session", auth, async (req, res, next) => {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ success: false, message: "No session ID provided" });

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session && session.payment_status === 'paid') {
            const userId = session.metadata?.userId;
            const planName = session.metadata?.planName;

            if (userId && planName) {
                const expiresAt = new Date();
                expiresAt.setMonth(expiresAt.getMonth() + 1);

                const updatedUser = await User.findByIdAndUpdate(userId, {
                    membership: planName,
                    subscriptionId: session.subscription,
                    membershipExpiresAt: expiresAt
                }, { new: true });

                try {
                    const formattedDate = new Date(expiresAt).toLocaleDateString();
                    await sendEmail(
                        updatedUser.email,
                        `Welcome to ${planName} - Modeva Atelier`,
                        subscriptionTemplate(updatedUser.name, planName, formattedDate)
                    );
                } catch (emailErr) {
                    console.error("Subscription email failed:", emailErr.message);
                }

                return res.status(200).json({ success: true, message: "Membership updated successfully!" });
            }
        }
        res.status(400).json({ success: false, message: "Payment not verified" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;