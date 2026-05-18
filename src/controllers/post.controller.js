import pool from '../config/db.js';
import AppError from '../utils/AppError.js';

const getAllPosts = async (req, res, next) => {
  try {
    let query = 'SELECT p.*, u.username as author_name FROM posts p JOIN users u ON p.author_id = u.id';
    const params = [];

    if (req.query.authorId) {
      query += ' WHERE p.author_id = $1';
      params.push(req.query.authorId);
    }

    query += ' ORDER BY p.created_at DESC';

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.status(200).json({
      status: 'success',
      results: result.rows.length,
      data: {
        posts: result.rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

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
        post: result.rows[0],
      },
    });
  } catch (err) {
    next(err);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, content, authorId } = req.body;

    const result = await pool.query(
      'INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, authorId]
    );

    res.status(201).json({
      status: 'success',
      data: {
        post: result.rows[0],
      },
    });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const checkResult = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      throw new AppError('Post not found', 404);
    }

    const result = await pool.query(
      'UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [title, content, id]
    );

    res.status(200).json({
      status: 'success',
      data: {
        post: result.rows[0],
      },
    });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const checkResult = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      throw new AppError('Post not found', 404);
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [id]);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export { getAllPosts, getPostById, createPost, updatePost, deletePost };