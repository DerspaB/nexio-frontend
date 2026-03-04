import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  role: z.enum(['ADMIN', 'COACH', 'CLIENT'], {
    required_error: 'El rol es requerido',
  }),
  coachId: z.string().uuid().optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.enum(['ADMIN', 'COACH', 'CLIENT']).optional(),
  coachId: z.string().uuid().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type PaginationQueryData = z.infer<typeof paginationQuerySchema>;
