import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  isTemplate: z.boolean().default(false),
  durationWeeks: z.coerce.number().int().min(1, 'Mínimo 1 semana'),
  clientId: z.string().uuid().optional(),
});

export const updatePlanSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  status: z.enum(['TEMPLATE', 'ACTIVE', 'PAUSED', 'COMPLETED']).optional(),
  durationWeeks: z.coerce.number().int().min(1).optional(),
});

export const planFiltersSchema = z.object({
  clientId: z.string().uuid().optional(),
  isTemplate: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
  status: z.enum(['TEMPLATE', 'ACTIVE', 'PAUSED', 'COMPLETED']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const createWorkoutDaySchema = z.object({
  planId: z.string().uuid(),
  dayOfWeek: z.coerce.number().int().min(1).max(7),
  name: z.string().min(1, 'El nombre es requerido'),
  order: z.coerce.number().int().min(0),
});

export const updateWorkoutDaySchema = z.object({
  dayOfWeek: z.coerce.number().int().min(1).max(7).optional(),
  name: z.string().min(1).optional(),
  order: z.coerce.number().int().min(0).optional(),
});

export const createBlockSchema = z.object({
  workoutDayId: z.string().uuid(),
  type: z.enum(['EXERCISE', 'SUPERSET', 'REST', 'NOTE']).default('EXERCISE'),
  order: z.coerce.number().int().min(0),
  exerciseId: z.string().uuid().optional().nullable(),
  sets: z.coerce.number().int().min(0).default(0),
  reps: z.string().default(''),
  restSeconds: z.coerce.number().int().min(0).default(0),
  notes: z.string().optional().nullable(),
});

export const updateBlockSchema = z.object({
  type: z.enum(['EXERCISE', 'SUPERSET', 'REST', 'NOTE']).optional(),
  order: z.coerce.number().int().min(0).optional(),
  exerciseId: z.string().uuid().optional().nullable(),
  sets: z.coerce.number().int().min(0).optional(),
  reps: z.string().optional(),
  restSeconds: z.coerce.number().int().min(0).optional(),
  notes: z.string().nullable().optional(),
});

export const reorderBlocksSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      order: z.number().int().min(0),
    }),
  ),
});

export type CreatePlanFormData = z.infer<typeof createPlanSchema>;
export type UpdatePlanFormData = z.infer<typeof updatePlanSchema>;
export type PlanFiltersData = z.infer<typeof planFiltersSchema>;
export type CreateWorkoutDayFormData = z.infer<typeof createWorkoutDaySchema>;
export type UpdateWorkoutDayFormData = z.infer<typeof updateWorkoutDaySchema>;
export type CreateBlockFormData = z.infer<typeof createBlockSchema>;
export type UpdateBlockFormData = z.infer<typeof updateBlockSchema>;
export type ReorderBlocksFormData = z.infer<typeof reorderBlocksSchema>;
