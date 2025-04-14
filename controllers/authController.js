const { isJWT } = require('validator');
const User = require('../schema/User');
const bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
const { userAuth } = require("../middleware/userAuth")

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Remove password before sending user data
        const { password: _, ...userData } = user.toObject();

        //cookies to retrive 
        const token = await jwt.sign({ _id: user._id }, "anish@dev")
        console.log(token);
        res.cookie("token", token);

        res.status(200).json({
            message: 'Login successful',
            user: userData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//porfile 
// const profile = async (req, res) => {
//     try {
//         const cookies = req.cookies;
//         const { token } = cookies;
//         if (!token) {
//             throw new Error("Invalid Token")
//         }
//         //validate token
//         const decodedMessage = await jwt.verify(token, "anish@dev");
//         console.log(decodedMessage);
//         const { _id } = decodedMessage;
//         console.log("the logedin user is " + _id)

//         const user = await User.findById(_id)
//         if (!user) {
//             throw new Error("Invalid user")
//         }
//         res.status(200).json({
//             message: "Reading cookies",
//             user,
//         });

//     } catch (err) {
//         res.status(400).send("Error:" + err.message)
//     }
// };
//note other api is not secure we need to create a middleware so that other middleware is secure

//note again after forming middlew we need to update below code 
const profile = async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send(err.message)
    }

}


//invalid code below 

// const updateUser = userAuth, async (req, res) => {
//     const updates = req.body; // Example: { name, address, phone }

//     try {
//         // const userId = req.userId; // This should be set in your auth middleware
//         const userId = '67fa17346c30661279949770';

//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             { $set: updates },
//             { new: true }
//         );

//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json({
//             message: 'User updated successfully',
//             user: updatedUser
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


const updateUser = async (req, res) => {
    const updates = req.body;

    try {
        const userId = req.user._id; // From middleware

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const logout = async (req, res) => {
    try {
        // Clear the auth token cookie
        res.clearCookie('token'); // Replace 'token' with your actual cookie name
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = { signup, login, logout, updateUser, profile };

