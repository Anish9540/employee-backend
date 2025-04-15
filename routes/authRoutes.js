const express = require('express');
const { signup, login, logout, updateUser, profile } = require('../controllers/authController');
const { userAuth } = require("../middleware/userAuth")

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', userAuth, logout);
router.patch('/updateUser', userAuth, updateUser);
//For learning I created prfile 
router.get('/profile', userAuth, profile);

module.exports = router;
