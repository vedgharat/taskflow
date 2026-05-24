import asyncHandler from '../middlewares/asyncHandler.js';
import * as taskService from '../services/taskService.js';

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
export const createTask = asyncHandler(async (req, res) => {
  const result = await taskService.createTask(req.user._id, req.body);
  res.status(201).json({ success: true, ...result });
});

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks (filtered, paginated)
 * @access  Private
 */
export const getTasks = asyncHandler(async (req, res) => {
  const result = await taskService.getTasks(req.user._id, req.query);
  res.status(200).json({ success: true, ...result });
});

/**
 * @route   GET /api/tasks/stats
 * @desc    Get task statistics for dashboard
 * @access  Private
 */
export const getTaskStats = asyncHandler(async (req, res) => {
  const stats = await taskService.getTaskStats(req.user._id);
  res.status(200).json({ success: true, stats });
});

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 * @access  Private
 */
export const getTaskById = asyncHandler(async (req, res) => {
  const result = await taskService.getTaskById(req.user._id, req.params.id);
  res.status(200).json({ success: true, ...result });
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
export const updateTask = asyncHandler(async (req, res) => {
  const result = await taskService.updateTask(req.user._id, req.params.id, req.body);
  res.status(200).json({ success: true, ...result });
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
export const deleteTask = asyncHandler(async (req, res) => {
  const result = await taskService.deleteTask(req.user._id, req.params.id);
  res.status(200).json({ success: true, ...result });
});
