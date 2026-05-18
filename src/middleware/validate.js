import Joi from 'joi';
import AppError from '../utils/AppError.js';

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const messages = error.details.map((detail) => detail.message).join(', ');
    throw new AppError(`Validation error: ${messages}`, 400);
  }

  next();
};

export { validate };