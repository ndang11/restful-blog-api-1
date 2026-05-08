// Auth routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/schemas');
const { apiLimiter, authLimiter } = require('../middleware/rateLimiter');
const upload = require('../middleware/upload');

// Apply general API limiter to all auth routes
router.use(apiLimiter);

// Stricter limiter for auth endpoints
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
// Profile picture upload (protected route)
router.post('/upload-profile-pic', authController.refreshToken, upload, (req, res) => {
// Note: In a real app, we'd protect this with authenticate middleware
// For now, using refreshToken as placeholder - should be replaced with authenticate
  res.status(200).json({
    status: 'success',
    message: 'Profile picture uploaded successfully',
    data: {
      filePath: req.file.path
    }
  });
});

module.exports = router;