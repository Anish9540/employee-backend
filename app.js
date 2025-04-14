const express = require('express');
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const env = require('dotenv');
const connectDB = require('./database/connect');
const authRoutes = require('./routes/authRoutes');


env.config();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);


app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

connectDB()
    .then(() => {
        console.log("Database connection established...");
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Server is successfully listening on port ${PORT}...`);
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected!!", err);
    });
