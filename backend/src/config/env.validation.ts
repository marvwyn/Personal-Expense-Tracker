import * as Joi from 'joi';

// Fails fast at bootstrap if required env vars are missing/malformed, rather than
// surfacing as a confusing runtime error the first time the DB or JWT is touched.
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  CORS_ORIGIN: Joi.string().default('http://localhost:5173'),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRY: Joi.number().default(86400),
});
