// authentication routes using Express.js with Passport.js and JWT

const express = require('express');
const { loginUser, registerUser, logoutUser } = require('../controlers/authController');
const { authenticateJWT } = require('..middlewares/authmiddleware');
const router = express.Router();

// Route: Register a new user
router.post('/register', registerUser);

// Route: login user
router.post('/login', loginUser);

// Route: logout user
router.post('/logout', authenticateJWT, loginUser);

module.exports = router;