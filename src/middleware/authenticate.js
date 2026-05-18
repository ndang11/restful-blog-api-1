import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import pool from '../config/db.js';
import env from '../config/env.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('You are not logged in! Please log in to get access.', 401);
    }
    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.jwtSecret);

    const currentUser = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    if (currentUser.rows.length === 0) {
      throw new AppError('The user belonging to this token does no longer exist.', 401);
    }

    req.user = currentUser.rows[0];
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      err = new AppError('Invalid token! Please log in again.', 401);
    }
    next(err);
  }
};

export default authenticate;