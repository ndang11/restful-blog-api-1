// Joi schema middleware factory
const Joi = require('joi');
const { AppError } = require('../utils/AppError');

/**
 * Middleware factory for validating request data against a Joi schema
 * @param {Object} schema - Joi schema object
 * @returns {Function} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
  // Validate request body
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    // Extract validation messages
    const messages = error.details.map(detail => detail.message).join(', ');
    throw new AppError(`Validation error: ${messages}`, 400);
  }
  
  // If validation passes, move to next middleware
  next();
};

module.exports = { validate };