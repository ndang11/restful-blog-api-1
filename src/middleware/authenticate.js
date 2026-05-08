// JWT verification middleware
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/AppError');
const { pool } = require('../config/db');

const authenticate = async (req, res, next) => {
  try {
    // Get token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('You are not logged in! Please log in to get access.', 401);
    }
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    if (currentUser.rows.length === 0) {
      throw new AppError('The user belonging to this token does no longer exist.', 401);
    }

    // Attach user to request
    req.user = currentUser.rows[0];
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      err = new AppError('Invalid token! Please log in again.', 401);
    }
    next(err);
  }
};

module.exports = { authenticate };