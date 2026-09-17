require("dotenv").config();
const chalk = require("chalk");
const { setServers } = require("dns/promises");

setServers(["8.8.8.8" , "8.8.4.4"]);

const app = require("./app");

// التعديل هنا: تمت إضافة /src قبل مسار مجلد config
const connectDB = require("./src/config/connectDB");

app.set("query parser", "extended");

connectDB();

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(chalk.bgGreen(`Server is running at port ${port}`));
});