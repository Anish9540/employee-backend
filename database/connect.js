const mongoose = require("mongoose");

const connectDB = async () => {
    console.log(process.env.DATABASE_URL);
    await mongoose.connect(process.env.DATABASE_URL);
};

module.exports = connectDB;