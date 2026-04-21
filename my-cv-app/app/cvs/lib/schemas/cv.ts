import { z } from 'zod';

export const cvListSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  fullname: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  education: z.string().min(1, 'Education is required'),
  description: z.string().min(1, 'Description is required'),
});

export const cvDetailsSchema = z.object({
  fullname: z.string().min(1, 'Full name is required'),
  education: z.string().min(1, 'Education is required'),
  description: z.string().min(1, 'Description is required'),
});

export type CVListFormData = z.infer<typeof cvListSchema>;
export type CVDetailsFormData = z.infer<typeof cvDetailsSchema>;