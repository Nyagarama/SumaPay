// handles authentication
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const redisClient = require('.../config/redis');

// Register a new user
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Member registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user
        const user = await User.findOne({ enail });
        if (!user) return res.status(404).json({ message: 'user not found!' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(404).json({ message: 'Invalid Credentials!' });

        // Generate jwt token
        const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET,{ expiresIn: '1h' });
        res.status(200).json({ message: 'Login successfull', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Logout user..... using redis
exports.logoutUser = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(404).json({ message: 'No token provided' });
    } try {
        // Decode the token to get the expiration time
        const decode = JWT.verify(token, process.env.JWT_SECRET);
        // Add redis to the blacklist with expiry time
        const expiryTime = decode.exp - Math.floor(Date.now() / 1000);

        res.status(200).json({ message: 'Logout successfull'});
    } catch (error) {
        res.status(400).json({ message: 'Invalid token', error });
    }
};