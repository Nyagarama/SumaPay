const jwt = require('jsonwebtoken');
const User = require('../models/groups');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const authenticateGroup = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const authorizeGroupAccess = (req, res, next) => {
  const { groupName } = req.params;
  
  if (!req.user.groups.includes(groupName)) {
    return res.status(403).json({ 
      error: 'Unauthorized access to group' 
    });
  }

  next();
};

// Token generation utility
export const generateGroupToken = (userId, groups) => {
  return jwt.sign(
    { userId, groups }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );
};