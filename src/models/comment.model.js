import pool from '../config/db.js';

const getCommentsByPostId = async (postId) => {
  const result = await pool.query(
    'SELECT c.*, u.username as author_name FROM comments c JOIN users u ON c.author_id = u.id WHERE c.post_id = $1 ORDER BY c.created_at ASC',
    [postId]
  );
  return result.rows;
};

const getCommentById = async (id) => {
  const result = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
  return result.rows[0];
};

// Create comment
const createComment = async (content, authorId, postId) => {
  const result = await pool.query(
    'INSERT INTO comments (content, author_id, post_id) VALUES ($1, $2, $3) RETURNING *',
    [content, authorId, postId]
  );
  return result.rows[0];
};

// Update comment
const updateComment = async (id, content) => {
  const result = await pool.query(
    'UPDATE comments SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [content, id]
  );
  return result.rows[0];
};

// Delete comment
const deleteComment = async (id) => {
  await pool.query('DELETE FROM comments WHERE id = $1', [id]);
};

export {
  getCommentsByPostId,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};