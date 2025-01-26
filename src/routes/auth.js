// server/src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Member = require('../models/Member');
const { verifyToken, isAdmin } = require('../middleware/auth');
 
// Input validation middleware
const validateRegistration = (req, res, next) => {
    const { username, email, password } = req.body;
    
    // Basic validation rules
    if (!username || username.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }
    
    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Valid email is required' });
    }
    
    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    next();
};
 
// Register new user
router.post('/register', validateRegistration, async (req, res) => {
    try {
        const { username, email, password, role = 'member' } = req.body;
 
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
 
        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email or username already exists'
            });
        }
 
        // Create new user
        const user = new User({
            username,
            email,
            password, // Will be hashed via mongoose pre-save hook
            role
        });
 
        await user.save();
 
        // If user is a member, create member profile
        if (role === 'member') {
            const member = new Member({
                userId: user._id,
                status: 'active'
            });
            await member.save();
        }
 
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
 
        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 
// Login user
router.post('/login', async (req, res) => {
    // placeholder json
    res.json({'message': 'You have reached login'});
 
    try {
        const { email, password } = req.body;
 
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
 
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
 
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
 
        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
 
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 
// Get current user (protected route)
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
 
        let userData = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };
 
        // If user is a member, include member data
        if (user.role === 'member') {
            const member = await Member.findOne({ userId: user._id });
            if (member) {
                userData.memberData = {
                    totalContributions: member.totalContributions,
                    availableBalance: member.availableBalance,
                    loanLimit: member.loanLimit,
                    status: member.status
                };
            }
        }
 
        res.json(userData);
 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 
// Change password (protected route)
router.post('/change-password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                message: 'Current password and new password are required' 
            });
        }
 
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                message: 'New password must be at least 6 characters long' 
            });
        }
 
        const user = await User.findById(req.user.id);
        
        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
 
        // Update password
        user.password = newPassword; // Will be hashed via mongoose pre-save hook
        await user.save();
 
        res.json({ message: 'Password updated successfully' });
 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 
// Logout (optional - client-side token removal)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' }); 
    // Note: Actual token invalidation would be handled client-side
});
 
// Admin route to get all users
router.get('/users', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 
// placeholder functions for login signup and logout
 
const signup = (req, res) => {
  res.json({'Message': 'Signup function placeholder'});
};
 
const login = (req, res) => {
  res.send('Login function placeholder');
};
 
const logout = (req, res) => {
  res.send('Logout function placeholder');
};
 
module.exports = {
  router,
  signup,
  login,
  logout
};
 