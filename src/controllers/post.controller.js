// Post controller
const { pool } = require('../config/db');
const { AppError } = require('../utils/AppError');

// Get all posts (with optional filtering and pagination)
const getAllPosts = async (req, res, next) => {
  try {
    let query = 'SELECT p.*, u.username as author_name FROM posts p JOIN users u ON p.author_id = u.id';
    const params = [];
    
    // Filter by author if provided
    if (req.query.authorId) {
      query += ' WHERE p.author_id = $1';
      params.push(req.query.authorId);
    }
    
    // Add ordering and pagination
    query += ' ORDER BY p.created_at DESC';
    
    // Pagination (default: limit 10, offset 0)
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.status(200).json({
      status: 'success',
      results: result.rows.length,
      data: {
        posts: result.rows
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get a single post by ID
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT p.*, u.username as author_name FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new AppError('Post not found', 404);
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        post: result.rows[0]
      }
    });
  } catch (err) {
    next(err);
  }
};

// Create a new post
const createPost = async (req, res, next) => {
  try {
    const { title, content, authorId } = req.body;
    
    // In a real app, authorId would come from authenticated user
    // For now, we'll use the one from body (should be validated by middleware)
    
    const result = await pool.query(
      'INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, authorId]
    );
    
    res.status(201).json({
      status: 'success',
      data: {
        post: result.rows[0]
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update a post
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    // Check if post exists
    const checkResult = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      throw new AppError('Post not found', 404);
    }
    
    // In a real app, we'd check if the authenticated user is the author
    
    const result = await pool.query(
      'UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        post: result.rows[0]
      }
    });
  } catch (err) {
    next(err);
  }
};

// Delete a post
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if post exists
    const checkResult = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      throw new AppError('Post not found', 404);
    }
    
    // In a real app, we'd check if the authenticated user is the author
    
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};