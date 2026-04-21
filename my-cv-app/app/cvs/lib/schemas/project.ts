import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  domain: z.string().min(1, 'Domain is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  bulletPoints: z.string().optional(),
  environment: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;