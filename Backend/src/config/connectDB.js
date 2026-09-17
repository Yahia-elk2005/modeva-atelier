const mongoose = require("mongoose");

async function connectDB() {
    const isProduction = process.env.NODE_ENV === "production";

    const primaryURI = isProduction ? process.env.ATLAS_DATABASE : process.env.LOCAL_DATABASE;
    const fallbackURI = isProduction ? process.env.LOCAL_DATABASE : process.env.ATLAS_DATABASE;

    try {
        if (primaryURI) {
            const con = await mongoose.connect(primaryURI);
            console.log(`✅ Database connected successfully to ${isProduction ? 'Cloud (Atlas)' : 'Local'} at ${con.connection.name}`);
            return; 
        }
    } catch (error) {
        console.log(`⚠️ Primary database connection failed. Trying fallback...`);
    }

    try {
    
        if (fallbackURI) {
            const con = await mongoose.connect(fallbackURI);
            console.log(`✅ Fallback Database connected successfully at ${con.connection.name}`);
        } else {
            console.error("❌ No valid database URI found in .env variables.");
        }
    } catch (error) {
        console.error("❌ All database connections completely failed:", error.message);
    }
}

module.exports = connectDB;