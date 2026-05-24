import asyncHandler from '../middlewares/asyncHandler.js';
import * as authService from '../services/authService.js';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({ success: true, ...result });
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return token
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.status(200).json({ success: true, ...result });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const result = await authService.getMe(req.user._id);
  res.status(200).json({ success: true, ...result });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile settings
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const result = await authService.updateUserProfile(req.user._id, req.body);
  res.status(200).json({ success: true, ...result });
});
