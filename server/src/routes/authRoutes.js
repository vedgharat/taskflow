import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/authValidator.js';
import validate from '../middlewares/validate.js';
import protect from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);

export default router;
