/**
 * Wraps an async Express route handler to catch rejected promises
 * and forward them to the global error-handling middleware.
 *
 * Usage: router.get('/path', asyncHandler(myController));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
