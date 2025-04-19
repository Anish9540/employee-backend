const jwt = require("jsonwebtoken");
const User = require("../schema/User");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) throw new Error("Invalid Token");

        const decodedObj = jwt.verify(token, "anish@dev");
        const { _id } = decodedObj;

        const user = await User.findById(_id);
        if (!user) throw new Error("User not found");

        req.user = user; // Attach user to request for later use
        next();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { userAuth };



