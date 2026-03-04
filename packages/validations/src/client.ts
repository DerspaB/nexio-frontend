import { z } from 'zod';

export const createClientSchema = z.object({
  email: z.string().email('Email inválido'),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  coachId: z.string().uuid().optional(),
});

export const updateClientSchema = z.object({
  status: z.enum(['ACTIVE', 'AT_RISK', 'TRIAL', 'INACTIVE']).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const clientFiltersSchema = z.object({
  status: z.enum(['ACTIVE', 'AT_RISK', 'TRIAL', 'INACTIVE']).optional(),
  search: z.string().optional(),
  coachId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;
export type ClientFiltersData = z.infer<typeof clientFiltersSchema>;
