import { z } from 'zod';

export const createCheckInSchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  status: z.enum(['COMPLETED', 'PARTIAL', 'SKIPPED']),
  workoutDayId: z.string().uuid().optional(),
  completedBlocks: z.coerce.number().int().min(0),
  totalBlocks: z.coerce.number().int().min(0),
  notes: z.string().optional(),
  durationMinutes: z.coerce.number().int().min(0).optional(),
});

export const checkInFiltersSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateCheckInFormData = z.infer<typeof createCheckInSchema>;
export type CheckInFiltersData = z.infer<typeof checkInFiltersSchema>;
