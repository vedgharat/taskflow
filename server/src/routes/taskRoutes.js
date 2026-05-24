import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController.js';
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} from '../validators/taskValidator.js';
import validate from '../middlewares/validate.js';
import protect from '../middlewares/authMiddleware.js';

const router = Router();

// All task routes require authentication
router.use(protect);

router
  .route('/')
  .get(validate(taskQuerySchema, 'query'), getTasks)
  .post(validate(createTaskSchema), createTask);

// Stats must be before /:id to avoid matching "stats" as an ID
router.get('/stats', getTaskStats);

router
  .route('/:id')
  .get(getTaskById)
  .put(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

export default router;
