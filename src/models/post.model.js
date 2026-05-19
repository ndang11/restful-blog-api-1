const { pool } = require('../config/db');

const getAllPosts = async (filters = {}) => {
  let query = 'SELECT p.*, u.username as author_name FROM posts p JOIN users u ON p.author_id = u.id';
  const params = [];
  const whereClauses = [];
  
  // Filter by author
  if (filters.authorId) {
    whereClauses.push(`p.author_id = $${params.length + 1}`);
    params.push(filters.authorId);
  }
  
  if (whereClauses.length > 0) {
    query += ' WHERE ' + whereClauses.join(' AND ');
  }
  
  query += ' ORDER BY p.created_at DESC';
  
  // Pagination
  const limit = filters.limit || 10;
  const offset = filters.offset || 0;
  query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);
  
  const result = await pool.query(query, params);
  return result.rows;
};

// Get post by id
const getPostById = async (id) => {
  const result = await pool.query(
    'SELECT p.*, u.username as author_name FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = $1',
    [id]
  );
  return result.rows[0];
};

// Create post
const createPost = async (title, content, authorId) => {
  const result = await pool.query(
    'INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
    [title, content, authorId]
  );
  return result.rows[0];
};

// Update post
const updatePost = async (id, title, content) => {
  const result = await pool.query(
    'UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
    [title, content, id]
  );
  return result.rows[0];
};

// Delete post
const deletePost = async (id) => {
  await pool.query('DELETE FROM posts WHERE id = $1', [id]);
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};