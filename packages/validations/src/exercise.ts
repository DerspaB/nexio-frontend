import { z } from 'zod';

export const exerciseFiltersSchema = z.object({
  muscleGroup: z.string().optional(),
  equipment: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type ExerciseFiltersData = z.infer<typeof exerciseFiltersSchema>;
