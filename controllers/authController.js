const User = require('../schema/User');
const bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const signup = async (req, res) => {
    const { name, email, password, roleStatus } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, roleStatus });
        await user.save();

        const { password: _, ...userData } = user.toObject();

        // Generate token
        const token = jwt.sign({ _id: user._id }, "anish@dev", {
            expiresIn: "7d",
        });

        // Send token as cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Lax",
            // secure: true // use in production with HTTPS
        });

        res.status(201).json({
            message: "Signup successful",
            user: userData,
        });
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


const profile = async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send(err.message)
    }

}

const updateUser = async (req, res) => {
    const {
        userId,
        name,
        email,
        role,
        roleStatus,
        department,
        status,
        score,
        performanceMetrics
    } = req.body;

    console.log('🔍 Received userId:', userId);

    if (!userId) {
        return res.status(400).json({ message: 'Missing userId in request body' });
    }

    const allowedPerformanceUpdates = [
        'hackerrankScore',
        'leetcodeScore',
        'learningCertificatesDone',
        'coursesCompleted',
        'week1Score',
        'week2Score',
        'week3Score',
        'assignment1Percentage',
        'assignment2Percentage',
        'assignment3Percentage',
        'EFTestScore',
        'mockEvaluation1Score',
        'mockEvaluation2Score',
        'mockEvaluation3Score',
    ];

    const updateFields = {};

    if (performanceMetrics && typeof performanceMetrics === 'object') {
        for (let key of allowedPerformanceUpdates) {
            if (key in performanceMetrics) {
                updateFields[`performanceMetrics.${key}`] = performanceMetrics[key];
            }
        }
    }

    // ✅ Handle top-level user fields
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    if (roleStatus) updateFields.roleStatus = roleStatus;
    if (department) updateFields.department = department;
    if (status) updateFields.status = status;
    if (typeof score !== 'undefined') updateFields.score = score;


    if (req.files && req.files.img) {
        const image = req.files.img;
        const uploadDir = path.join(__dirname, '..', 'uploads');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const imageName = `${Date.now()}-${image.name}`;
        const uploadPath = path.join(uploadDir, imageName);

        try {
            await image.mv(uploadPath);
            updateFields.img = `/uploads/${imageName}`;
            console.log('✅ Image uploaded:', updateFields.img);
        } catch (err) {
            console.error('❌ Image upload error:', err);
            return res.status(500).json({ message: 'Image upload failed', error: err.message });
        }
    }

    try {
        const userExists = await User.findById(userId);
        if (!userExists) {
            console.log('❌ No user found with ID:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true }
        );

        return res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('❗ Error updating user:', error);
        return res.status(500).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        // Clear the auth token cookie
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = { signup, login, logout, updateUser, profile };

