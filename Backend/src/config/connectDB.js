const mongoose = require("mongoose");
async function connectDB() {
    try {
        const con = await mongoose.connect(process.env.LOCAL_DATABASE || "mongodb://localhost:27017/modeva");
        console.log(`Database connected successfully at ${con.connection.name}`);
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}
module.exports = connectDB;