const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRouter = require("./src/routes/auth.route");
const productsRouter = require("./src/routes/product.route");
const ordersRouter = require("./src/routes/order.route");
const cartRouter = require("./src/routes/cart.route");
const wishlistRouter = require("./src/routes/wishlist.route");
const usersRouter = require("./src/routes/user.route");
const vouchersRouter = require("./src/routes/voucher.route"); 
const globalError = require("./src/middlewares/globalError");
const AppError = require("./src/utils/AppError");

const app = express();

app.use(cors()); 

app.use(helmet());

const authLimiter = rateLimit({
    max: 20,
    windowMs: 60 * 60 * 1000,
    message: "Too many attempts from this IP, please try again in an hour!"
});

app.use("/auth", authLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to MODEVA Haute Couture Server"
    });
});

app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);
app.use("/users", usersRouter);
app.use("/api/vouchers", require("./src/routes/voucher.route"));

app.use((req, res, next) => {
    next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use(globalError);

module.exports = app;