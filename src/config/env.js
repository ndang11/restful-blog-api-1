import Joi from 'joi';
import dotenv from 'dotenv';
dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().optional(),
    DB_HOST: Joi.string().default('localhost'),
    DB_PORT: Joi.number().default(5432),
    DB_USER: Joi.string().default('postgres'),
    DB_PASSWORD: Joi.string().allow('').default(''),
    DB_NAME: Joi.string().default('blogdb'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_SECRET_REFRESH: Joi.string().optional().description('JWT refresh secret key'),
    JWT_EXPIRES_IN: Joi.string()
      .default('30d')
      .description('JWT expiration interval'),
    BCRYPT_SALT_ROUNDS: Joi.number()
      .integer()
      .min(1)
      .default(12),
  })
  .unknown()
  .required();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env, { abortEarly: false });

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbUser: envVars.DB_USER,
  dbPassword: envVars.DB_PASSWORD,
  dbName: envVars.DB_NAME,
  jwtSecret: envVars.JWT_SECRET,
  jwtSecretRefresh: envVars.JWT_SECRET_REFRESH,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
  bcryptSaltRounds: envVars.BCRYPT_SALT_ROUNDS,
};