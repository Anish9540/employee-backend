// const jwt = require("jsonwebtoken")
// const User = require("../schema/User")

// const userAuth = async (req, res, next) => {
//     try {
//         //read the token from the req cookies
//         const { token } = req.cookies;
//         if (!token) {
//             throw new Error("Invalid Token")
//         }

//         //verify the token decode the token or validate the token
//         const decodedObj = await isJWT.verify(token, "anish@dev")

//         //after getting decoded message extract id 
//         const { _id } = decodedObj
//         const user = await User.findById(_id);
//         if (!user) {
//             throw new error("user not found")
//         }
//         next();

//     } catch (err) {
//         res.status(400).send("Error" + err.message)
//     }

// }

// module.export = { userAuth }


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



