// Posts routes
const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { authenticate } = require('../middleware/authenticate');
const { validate } = require('../middleware/validate');
const { postSchema, updatePostSchema } = require('../validators/schemas');
const { apiLimiter } = require('../middleware/rateLimiter');

// Apply general API limiter
router.use(apiLimiter);

// Protect all post routes with authentication
router.use(authenticate);

// Get all posts (with optional filtering and pagination)
router.get('/', postController.getAllPosts);

// Get a single post by ID
router.get('/:id', postController.getPostById);

// Create a new post
router.post('/', validate(postSchema), postController.createPost);

// Update a post
router.patch('/:id', validate(updatePostSchema), postController.updatePost);

// Delete a post
router.delete('/:id', postController.deletePost);

module.exports = router;