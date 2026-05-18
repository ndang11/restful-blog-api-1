import Joi from 'joi';

const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must only contain alphanumeric characters',
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must be at most 30 characters long',
      'any.required': 'Username is required',
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
});

const postSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title must be at most 100 characters long',
      'string.empty': 'Title is required',
      'any.required': 'Title is required',
    }),
  content: Joi.string()
    .min(10)
    .required()
    .messages({
      'string.min': 'Content must be at least 10 characters long',
      'string.empty': 'Content is required',
      'any.required': 'Content is required',
    }),
  authorId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Author ID must be a number',
      'number.integer': 'Author ID must be an integer',
      'number.positive': 'Author ID must be a positive number',
      'any.required': 'Author ID is required',
    }),
});

const updatePostSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title must be at most 100 characters long',
    }),
  content: Joi.string()
    .min(10)
    .messages({
      'string.min': 'Content must be at least 10 characters long',
    }),
});

const commentSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(500)
    .required()
    .messages({
      'string.min': 'Comment must be at least 1 character long',
      'string.max': 'Comment must be at most 500 characters long',
      'string.empty': 'Comment is required',
      'any.required': 'Comment is required',
    }),
  authorId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Author ID must be a number',
      'number.integer': 'Author ID must be an integer',
      'number.positive': 'Author ID must be a positive number',
      'any.required': 'Author ID is required',
    }),
  postId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Post ID must be a number',
      'number.integer': 'Post ID must be an integer',
      'number.positive': 'Post ID must be a positive number',
      'any.required': 'Post ID is required',
    }),
});

const updateCommentSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(500)
    .required()
    .messages({
      'string.min': 'Comment must be at least 1 character long',
      'string.max': 'Comment must be at most 500 characters long',
      'string.empty': 'Comment is required',
      'any.required': 'Comment is required',
    }),
});

export {
  registerSchema,
  loginSchema,
  postSchema,
  updatePostSchema,
  commentSchema,
  updateCommentSchema,
};