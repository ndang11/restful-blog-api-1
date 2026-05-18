import express from 'express';
import pool from '../config/db.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(apiLimiter);

router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query parameter "q" is required',
      });
    }

    const result = await pool.query(
      `SELECT p.*, u.username as author_name 
       FROM posts p 
       JOIN users u ON p.author_id = u.id 
       WHERE p.title ILIKE $1 OR p.content ILIKE $1
       ORDER BY p.created_at DESC`,
      [`%${q}`]
    );

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
});

export default router;