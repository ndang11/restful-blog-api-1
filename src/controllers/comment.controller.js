// Comment controller
const { pool } = require('../config/db');
const { AppError } = require('../utils/AppError');

// Get all comments for a post
const getCommentsByPostId = async (req, res, next) => {
  try {
    const { postId } = req.params;
    
    // Optional: Check if post exists
    const postCheck = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (postCheck.rows.length === 0) {
      throw new AppError('Post not found', 404);
    }
    
    const result = await pool.query(
      'SELECT c.*, u.username as author_name FROM comments c JOIN users u ON c.author_id = u.id WHERE c.post_id = $1 ORDER BY c.created_at ASC',
      [postId]
    );
    
    res.status(200).json({
      status: 'success',
      results: result.rows.length,
      data: {
        comments: result.rows
      }
    });
  } catch (err) {
    next(err);
  }
};

// Create a new comment
const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content, authorId } = req.body;
    
    // Check if post exists
    const postCheck = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (postCheck.rows.length === 0) {
      throw new AppError('Post not found', 404);
    }
    
    const result = await pool.query(
      'INSERT INTO comments (content, author_id, post_id) VALUES ($1, $2, $3) RETURNING *',
      [content, authorId, postId]
    );
    
    res.status(201).json({
      status: 'success',
      data: {
        comment: result.rows[0]
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update a comment
const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    // Check if comment exists
    const checkResult = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      throw new AppError('Comment not found', 404);
    }
    
    // In a real app, we'd check if the authenticated user is the author
    
    const result = await pool.query(
      'UPDATE comments SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [content, id]
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        comment: result.rows[0]
      }
    });
  } catch (err) {
    next(err);
  }
};

// Delete a comment
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if comment exists
    const checkResult = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      throw new AppError('Comment not found', 404);
    }
    
    // In a real app, we'd check if the authenticated user is the author
    
    await pool.query('DELETE FROM comments WHERE id = $1', [id]);
    
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment
};