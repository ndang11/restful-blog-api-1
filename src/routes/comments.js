import express from 'express';
import {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller.js';
import authenticate from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { commentSchema, updateCommentSchema } from '../validators/schemas.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(apiLimiter);
router.use(authenticate);

router.get('/:postId/comments', getCommentsByPostId);
router.post('/:postId/comments', validate(commentSchema), createComment);
router.patch('/comments/:id', validate(updateCommentSchema), updateComment);
router.delete('/comments/:id', deleteComment);

export default router;