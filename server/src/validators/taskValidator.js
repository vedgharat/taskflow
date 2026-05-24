import { z } from 'zod';

const statusEnum = z.enum(['pending', 'in-progress', 'completed']);
const priorityEnum = z.enum(['low', 'medium', 'high']);

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .default(''),
  status: statusEnum.default('pending'),
  priority: priorityEnum.default('medium'),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .nullable()
    .optional()
    .transform((val) => (val ? new Date(val) : null)),
  tags: z.array(z.string().trim()).default([]),
  subtasks: z
    .array(
      z.object({
        title: z.string().trim().min(1, 'Subtask title cannot be empty'),
        completed: z.boolean().default(false),
      })
    )
    .default([]),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(100, 'Title cannot exceed 100 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .nullable()
    .optional()
    .transform((val) => (val !== undefined ? (val ? new Date(val) : null) : undefined)),
  tags: z.array(z.string().trim()).optional(),
  subtasks: z
    .array(
      z.object({
        _id: z.string().optional(),
        title: z.string().trim().min(1, 'Subtask title cannot be empty'),
        completed: z.boolean(),
      })
    )
    .optional(),
});

export const taskQuerySchema = z.object({
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10), // raised max limit to 100 for boards/calendars
  search: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  sortBy: z.enum(['dueDate', 'priority', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
