import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import searchRoutes from './routes/search.js';

// Initialize express app
const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS for all origins (in production, you might want to restrict this)
app.use(cors());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // Limit JSON payload size

// Serving static files (uploads)
app.use(express.static('uploads'));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Apply global rate limiter to all requests
app.use(apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/search', searchRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Handle undefined routes - catch all non-API requests
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global error handling middleware
app.use(errorHandler);

export default app;