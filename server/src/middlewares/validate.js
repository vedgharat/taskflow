import { ValidationError } from '../errors/AppError.js';

/**
 * Creates an Express middleware that validates req.body (or req.query)
 * against a Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {'body' | 'query'} source - Which part of the request to validate
 */
const validate = (schema, source = 'body') => {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const messages = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new ValidationError(messages);
    }

    // Replace with parsed (coerced/transformed) data
    req[source] = result.data;
    next();
  };
};

export default validate;
