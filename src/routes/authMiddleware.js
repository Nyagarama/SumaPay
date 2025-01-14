// Middleware for protecting routes
const jwt = reqiure('jsonwebtoken');

exports.authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ Message: 'Access denied. No token provided' });

    try {
        const decoded = jwt.verify(token, ProcessingInstruction.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ Message: 'Invalid token' });
    }
};