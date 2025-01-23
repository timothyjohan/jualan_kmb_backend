const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Token tidak ditemukan');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rahasia123');
    const user = await User.findOne({ 
      _id: decoded._id,
      'tokens.token': token
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Silakan login terlebih dahulu',
      error: error.message
    });
  }
};

module.exports = auth; 