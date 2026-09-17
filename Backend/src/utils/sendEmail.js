const nodemailer = require("nodemailer");
const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS?.replace(/\s/g, '')
            }
        });
        await transporter.sendMail({
            from: `"MODEVA Atelier" <${process.env.USER_EMAIL}>`,
            to,
            subject,
            html
        });
    } catch (error) {
        throw new Error("Failed to send email");
    }
}
module.exports = sendEmail;