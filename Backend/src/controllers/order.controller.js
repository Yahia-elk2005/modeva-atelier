const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");
const orderTemplate = require("../utils/orderEmailTemplate");

exports.getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find()
        .populate("user", "name email")
        .populate("items.product", "name price image");
    res.status(200).json({
        success: true,
        totalOrders: orders.length,
        data: orders
    });
});

exports.getOneOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
        .populate("user", "name email")
        .populate("items.product", "name price image");
    if (!order) return next(new AppError(404, "Order not found"));
    res.status(200).json({
        success: true,
        data: order
    });
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })
        .populate("items.product", "name price image");
    res.status(200).json({
        success: true,
        totalOrders: orders.length,
        data: orders
    });
});

exports.addOrder = catchAsync(async (req, res, next) => {
    const { items, shippingAddress, shippingCost, total, paymentMethod, discountAmount } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
        return next(new AppError(400, "Please provide an items array"));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let calculatedTotal = 0;
        const processedItems = [];
        let emailItemsHtml = "<ul style='list-style:none; padding:0; margin:0;'>";

        for (const item of items) {
            let pId = item.product;
            if (typeof pId === 'object' && pId !== null) {
                pId = pId._id || pId.id;
            }
            if (!pId) {
                throw new AppError(400, "Invalid product reference in order items");
            }

            const dbProduct = await Product.findById(pId).session(session);
            if (!dbProduct || dbProduct.quantity < item.quantity) {
                throw new AppError(400, `Insufficient stock or product not found: ${dbProduct?.name || pId}`);
            }

            calculatedTotal += dbProduct.price * item.quantity;
            dbProduct.quantity -= item.quantity;
            await dbProduct.save({ session });

            processedItems.push({
                product: dbProduct._id,
                name: item.name || dbProduct.name,
                price: item.price || dbProduct.price,
                quantity: item.quantity,
                size: item.size || 'M'
            });

            emailItemsHtml += `<li style='margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:5px;'>
                <strong>${item.name || dbProduct.name}</strong><br>
                Size: ${item.size || 'M'} | Qty: ${item.quantity} | Price: $${item.price || dbProduct.price}
            </li>`;
        }
        emailItemsHtml += "</ul>";

        const finalShipping = shippingCost !== undefined ? shippingCost : 25;
        const finalTotalString = total || `$${(calculatedTotal + finalShipping).toFixed(2)}`;
        const chosenPaymentMethod = paymentMethod || "CARD";

        const order = await Order.create([{
            user: req.user._id,
            items: processedItems,
            shippingAddress: shippingAddress || "Giza Governorate",
            shippingCost: finalShipping,
            total: finalTotalString,
            paymentMethod: chosenPaymentMethod,
            status: "Confirmed"
        }], { session });

        let sessionUrl = "";
        if (chosenPaymentMethod === "CARD" && process.env.STRIPE_SECRET_KEY) {
            const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
            
            const subtotalAmount = processedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const shippingForStripe = (req.user.membership === 'Salon Prime' || req.user.membership === 'VIP Gold') ? 0 : finalShipping;
            
            let membershipDiscount = 0;
            if (req.user.membership === 'Salon Prime') {
                membershipDiscount = subtotalAmount * 0.15;
            } else if (req.user.membership === 'VIP Gold') {
                membershipDiscount = subtotalAmount * 0.25;
            }

            const totalDiscountApplied = membershipDiscount + (Number(discountAmount) || 0);
            const finalStripeAmount = Math.max(0, (subtotalAmount - totalDiscountApplied) + shippingForStripe);

            const line_items = [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: 'Modeva Atelier Order (Includes Discounts & Shipping)' },
                        unit_amount: Math.round(finalStripeAmount * 100)
                    },
                    quantity: 1
                }
            ];

            const stripeSession = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                success_url: `http://localhost:3000/dashboard`,
                cancel_url: `http://localhost:3000/cart`,
                customer_email: req.user.email,
                client_reference_id: order[0]._id.toString(),
                line_items
            });

            sessionUrl = stripeSession.url;
        }

        await session.commitTransaction();
        session.endSession();

        await Cart.findOneAndDelete({ user: req.user._id });

        try {
            const shortOrderId = order[0]._id.toString().substring(18).toUpperCase();
            const customMessage = `Your order has been placed successfully and is now being processed by our Atelier team.<br><br><strong>Shipping Address:</strong> ${shippingAddress || "Giza Governorate"}<br><strong>Payment Method:</strong> ${chosenPaymentMethod}<br><strong>Total:</strong> ${finalTotalString}`;
            
            await sendEmail(
                req.user.email,
                `Order Confirmed - #${shortOrderId}`,
                orderTemplate(req.user.name, shortOrderId, "Confirmed", customMessage, emailItemsHtml)
            );
        } catch (emailErr) {}

        res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            url: sessionUrl,
            data: order[0]
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return next(error);
    }
});

exports.shipOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user");
    if (!order) return next(new AppError(404, "Order not found"));
    order.status = "Dispatched";
    await order.save();
    try {
        const shortOrderId = order._id.toString().substring(18).toUpperCase();
        const customMessage = `Great news! Your custom order has been dispatched and is currently en route via our white-glove courier service.`;
        
        await sendEmail(
            order.user.email,
            `Order Dispatched - #${shortOrderId}`,
            orderTemplate(order.user.name, shortOrderId, "Dispatched", customMessage, "<em>Live tracking details will be available shortly in your Patron Dashboard.</em>")
        );
    } catch (emailErr) {}
    res.status(200).json({
        success: true,
        message: "Order status updated to Dispatched",
        data: order
    });
});

exports.requestAlteration = catchAsync(async (req, res, next) => {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return next(new AppError(404, "Order not found or unauthorized"));
    order.alterationRequested = true;
    order.status = "Alteration Requested";
    await order.save();
    try {
        const shortOrderId = order._id.toString().substring(18).toUpperCase();
        const customMessage = `We have received your micro-alteration request for this order. Our master tailor will review your profile measurements and contact you shortly.`;
        
        await sendEmail(
            req.user.email,
            `Alteration Request Received - #${shortOrderId}`,
            orderTemplate(req.user.name, shortOrderId, "Alteration Requested", customMessage, "<em>Our concierge team will contact you within 24 hours.</em>")
        );
    } catch (emailErr) {}
    res.status(200).json({
        success: true,
        message: "Micro-alteration request submitted",
        data: order
    });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
    const query = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
    const order = await Order.findOneAndDelete(query);
    if (!order) return next(new AppError(404, "Order not found or unauthorized"));
    res.status(200).json({
        success: true,
        message: "Order cancelled successfully"
    });
});