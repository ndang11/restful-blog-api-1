// Global error handler and 404 handler
const { AppError } = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  // Set default values if err is not an AppError
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // If operational error, send the message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or unknown error: don't leak error details
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

// 404 handler for undefined routes
const notFound = (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};

module.exports = { errorHandler, notFound };