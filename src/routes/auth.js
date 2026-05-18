import express from 'express';
import { register, login, refreshToken } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';
import { apiLimiter, authLimiter } from '../middleware/rateLimiter.js';
import authenticate from '../middleware/authenticate.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.use(apiLimiter);

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/upload-profile-pic', authenticate, upload, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Profile picture uploaded successfully',
    data: {
      filePath: req.file.path,
    },
  });
});

export default router;