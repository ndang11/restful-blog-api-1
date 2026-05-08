// Auth controller
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { AppError } = require('../utils/AppError');
const { generateAccessToken, generateRefreshToken } = require('../utils/authUtils'); // Assuming we'll create authUtils later

// For now, we'll implement token generation directly if authUtils doesn't exist
// But let's assume we'll create it in utils. If not, we'll adjust.

// Since we are creating the structure, we'll create a placeholder for authUtils in utils later.

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // Validation should be done via middleware, so we assume valid input here

    // Check if user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      throw new AppError('User already exists', 400);
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    const user = result.rows[0];

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in db (optional, for refresh token rotation)
    // await pool.query('INSERT INTO refresh_tokens (token, user_id) VALUES ($1, $2)', [refreshToken, user.id]);

    res.status(201).json({
      status: 'success',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      status: 'success',
      data: {
        accessToken,
        refreshToken
      }
    });
  } catch (err) {
    next(err);
  }
};

// Placeholder for refresh token endpoint
const refreshToken = (req, res) => {
  // Implementation would go here
  res.status(200).json({ status: 'success', message: 'Refresh token endpoint' });
};

module.exports = {
  register,
  login,
  refreshToken
};