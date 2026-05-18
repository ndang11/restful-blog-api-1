import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';
import authenticate from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { postSchema, updatePostSchema } from '../validators/schemas.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(apiLimiter);
router.use(authenticate);

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', validate(postSchema), createPost);
router.patch('/:id', validate(updatePostSchema), updatePost);
router.delete('/:id', deletePost);

export default router;