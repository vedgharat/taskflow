import Task from '../models/Task.js';
import { NotFoundError, ForbiddenError } from '../errors/AppError.js';

/**
 * Create a new task for a user.
 */
export const createTask = async (userId, data) => {
  const task = await Task.create({ ...data, user: userId });
  return { task };
};

/**
 * Get paginated, filtered tasks for a user.
 * @returns {{ tasks, total, page, pages }}
 */
export const getTasks = async (userId, query) => {
  const { status, priority, page, limit, search, tag, sortBy, sortOrder } = query;

  const filter = { user: userId };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (tag) {
    filter.tags = tag;
  }

  // Construct dynamic sort sorting object
  let sort = { createdAt: -1 };
  if (sortBy) {
    const order = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'priority') {
      sort = { priorityWeight: order, createdAt: -1 };
    } else {
      sort = { [sortBy]: order, createdAt: -1 };
    }
  }

  const total = await Task.countDocuments(filter);
  const pages = Math.ceil(total / limit) || 1;
  const skip = (page - 1) * limit;

  const tasks = await Task.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  return { tasks, total, page, pages };
};

/**
 * Get a single task by ID, verifying ownership.
 */
export const getTaskById = async (userId, taskId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new NotFoundError('Task');
  }
  if (task.user.toString() !== userId.toString()) {
    throw new ForbiddenError('You do not own this task');
  }
  return { task };
};

/**
 * Update a task by ID, verifying ownership.
 */
export const updateTask = async (userId, taskId, data) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new NotFoundError('Task');
  }
  if (task.user.toString() !== userId.toString()) {
    throw new ForbiddenError('You do not own this task');
  }

  Object.assign(task, data);
  await task.save();

  return { task };
};

/**
 * Delete a task by ID, verifying ownership.
 */
export const deleteTask = async (userId, taskId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new NotFoundError('Task');
  }
  if (task.user.toString() !== userId.toString()) {
    throw new ForbiddenError('You do not own this task');
  }

  await task.deleteOne();
  return { message: 'Task deleted successfully' };
};

/**
 * Get task count statistics grouped by status for a user.
 */
export const getTaskStats = async (userId) => {
  const pipeline = [
    { $match: { user: userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ];

  const results = await Task.aggregate(pipeline);

  const stats = {
    total: 0,
    pending: 0,
    'in-progress': 0,
    completed: 0,
  };

  results.forEach(({ _id, count }) => {
    stats[_id] = count;
    stats.total += count;
  });

  return stats;
};
