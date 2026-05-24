import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { UnauthorizedError, ValidationError } from '../errors/AppError.js';

/**
 * Generate a signed JWT for a given user ID.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Format user object for API responses (excludes sensitive fields).
 */
const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

/**
 * Register a new user.
 * @throws {ValidationError} if email already exists
 */
export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ValidationError('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  return { user: formatUser(user), token };
};

/**
 * Authenticate a user and return a JWT.
 * @throws {UnauthorizedError} if credentials are invalid
 */
export const loginUser = async ({ email, password }) => {
  // Explicitly select password since it's excluded by default
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = generateToken(user._id);

  return { user: formatUser(user), token };
};

/**
 * Get the current authenticated user's profile.
 */
export const getMe = async (userId) => {
  const user = await User.findById(userId);
  return { user: formatUser(user) };
};

/**
 * Update user profile details.
 */
export const updateUserProfile = async (userId, { name, email, currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new ValidationError('User not found');
  }

  if (email && email !== user.email) {
    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      throw new ValidationError('This email is already in use');
    }
    user.email = email;
  }

  if (name) {
    user.name = name;
  }

  if (newPassword) {
    if (!currentPassword) {
      throw new ValidationError('Current password is required to change password');
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ValidationError('Incorrect current password');
    }
    user.password = newPassword;
  }

  await user.save();
  return { user: formatUser(user) };
};
