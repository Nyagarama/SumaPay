// server/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = {
    // Verify JWT token
    verifyToken: async (req, res, next) => {
        try {
            let token;
            
            // Check for token in Authorization header
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
            }

            // Check if token exists
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Access denied. Token missing.'
                });
            }

            try {
                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // Get user from database (excluding password)
                const user = await User.findById(decoded.id).select('-password');
                
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid token. User not found.'
                    });
                }

                // Check if user is active
                if (user.status === 'inactive') {
                    return res.status(401).json({
                        success: false,
                        message: 'Account is inactive. Please contact administrator.'
                    });
                }

                // Add user info to request object
                req.user = {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                };

                next();
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token.'
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Authentication error.'
            });
        }
    },

    // Check if user is admin
    isAdmin: (req, res, next) => {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }
        next();
    },

    // Check if user is a member
    isMember: (req, res, next) => {
        if (!req.user || req.user.role !== 'member') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Member privileges required.'
            });
        }
        next();
    },

    // Check if user is accessing their own data or is admin
    isSameUserOrAdmin: (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        if (req.user.role !== 'admin' && req.params.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only access your own data.'
            });
        }
        next();
    },

    // Rate limiting middleware (basic example)
    rateLimiter: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.',
        handler: (req, res) => {
            res.status(429).json({
                success: false,
                message: 'Too many requests. Please try again later.'
            });
        }
    },

    // Error handler for authentication errors
    handleAuthError: (err, req, res, next) => {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }

        // For any other errors
        return res.status(500).json({
            success: false,
            message: 'Authentication error.'
        });
    }
};

module.exports = auth;

