import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { UnauthorizedError } from '../errors/AppError.js';
import asyncHandler from './asyncHandler.js';

/**
 * Middleware that verifies a JWT from the Authorization header
 * and attaches the authenticated user to req.user.
 */
const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new UnauthorizedError('User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Invalid or expired token');
    }
    throw error;
  }
});

export default protect;
