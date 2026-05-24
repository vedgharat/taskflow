import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(1, 'Name is required')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email')
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password cannot exceed 128 characters'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email')
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name cannot be empty')
    .max(50, 'Name cannot exceed 50 characters')
    .optional(),
  email: z
    .string()
    .trim()
    .email('Please provide a valid email')
    .toLowerCase()
    .optional(),
  currentPassword: z
    .string()
    .min(1, 'Current password is required')
    .optional(),
  newPassword: z
    .string()
    .min(6, 'New password must be at least 6 characters')
    .max(128, 'New password cannot exceed 128 characters')
    .optional(),
}).refine(
  (data) => {
    if (data.newPassword && !data.currentPassword) {
      return false;
    }
    return true;
  },
  {
    message: 'Current password is required to set a new password',
    path: ['currentPassword'],
  }
);
