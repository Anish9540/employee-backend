const express = require('express');
const { signup, login, logout, updateUser, profile } = require('../controllers/authController');
const { userAuth } = require("../middleware/userAuth")

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.patch('/updateUser', userAuth, updateUser);
router.get('/profile', userAuth, profile);

module.exports = router;
