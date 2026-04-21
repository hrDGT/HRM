import { z } from 'zod';

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  categoryId: z.string().optional(),
  mastery: z.enum(['Novice', 'Competent', 'Proficient', 'Expert']).default('Proficient'),
});

export type SkillFormData = z.infer<typeof skillSchema>;