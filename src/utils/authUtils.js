import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    env.jwtSecret,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    env.jwtSecretRefresh || env.jwtSecret,
    { expiresIn: '30d' }
  );
};

export { generateAccessToken, generateRefreshToken };