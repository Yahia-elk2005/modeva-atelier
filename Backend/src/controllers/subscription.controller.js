const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createSubscriptionCheckout = catchAsync(async (req, res, next) => {
    const { plan } = req.body;
    
    const user = await User.findById(req.user._id);

    const tierLevels = {
        'Standard': 1,
        'Salon Prime': 2,
        'VIP Gold': 3
    };

    const currentTierLevel = tierLevels[user.membership || 'Standard'];
    const requestedTierLevel = tierLevels[plan];

    const isSubscriptionActive = user.membershipExpiresAt && new Date(user.membershipExpiresAt) > new Date();

    if (isSubscriptionActive) {
        if (user.membership === plan) {
            const expiryDate = new Date(user.membershipExpiresAt).toLocaleDateString();
            return next(new AppError(400, `You are already subscribed to the ${plan} tier. Your subscription will expire on ${expiryDate}.`));
        }

        if (requestedTierLevel < currentTierLevel) {
            const expiryDate = new Date(user.membershipExpiresAt).toLocaleDateString();
            return next(new AppError(400, `You are currently on the higher ${user.membership} tier, which remains active until ${expiryDate}. You cannot downgrade to a lower plan until it expires.`));
        }
    }

    let unitAmount = 2500; 
    let planDisplayName = 'Salon Prime Membership';

    if (plan === 'VIP Gold') {
        unitAmount = 5000; 
        planDisplayName = 'VIP Gold Membership';
    } else if (plan === 'Salon Prime') {
        unitAmount = 2500; 
        planDisplayName = 'Salon Prime Membership';
    } else {
        return next(new AppError(400, 'Invalid membership plan selected'));
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
        });
        customerId = customer.id;
        user.stripeCustomerId = customerId;
        await user.save();
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: planDisplayName,
                },
                unit_amount: unitAmount,
                recurring: {
                    interval: 'month',
                },
            },
            quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${frontendUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancel_url: `${frontendUrl}/dashboard?canceled=true`,
        metadata: {
            userId: user._id.toString(),
            planName: plan
        }
    });

    res.status(200).json({
        success: true,
        url: session.url
    });
});

exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const planName = session.metadata?.planName;

        if (userId && planName) {
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1);

            await User.findByIdAndUpdate(userId, {
                membership: planName,
                subscriptionId: session.subscription,
                membershipExpiresAt: expiresAt
            });
        }
    }

    res.status(200).json({ received: true });
};