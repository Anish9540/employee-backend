const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: true,
//         },
//         email: {
//             type: String,
//             required: true,
//             unique: true,
//         },
//         password: {
//             type: String,
//             required: true,
//         },
//     }
// );
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: 'employee',
        },
        status: {
            type: String,
            enum: ['In_Progress', 'Completed', 'On_Hold'],
            default: 'In_Progress',
        },
        score: {
            type: Number,
            default: 0,
        },
        department: {
            type: String,
            // required: true,
        },
        joinDate: {
            type: Date,
            // required: true,
        },
        img: {
            type: String,
        },
        performanceMetrics: {
            leetcodeScore: { type: Number, default: 0 },
            hackerrankScore: { type: Number, default: 0 },
            week1Score: { type: Number, default: 0 },
            week2Score: { type: Number, default: 0 },
            week3Score: { type: Number, default: 0 },
            assignment1Percentage: { type: Number, default: 0 },
            assignment2Percentage: { type: Number, default: 0 },
            assignment3Percentage: { type: Number, default: 0 },
            EFTestScore: { type: Number, default: 0 },
            learningCertificatesDone: { type: [String], default: [] },
            coursesCompleted: { type: [String], default: [] },
            mockEvaluation1Score: { type: Number, default: 0 },
            mockEvaluation2Score: { type: Number, default: 0 },
            mockEvaluation3Score: { type: Number, default: 0 },
        },
    },
    {
        timestamps: true,
    }
);

// userSchema.methods.getJWT = async function () {
//     const user = this;

//     const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
//         expiresIn: "7d",
//     });

//     return token;
// };

const User = mongoose.model('User', userSchema);

module.exports = User;