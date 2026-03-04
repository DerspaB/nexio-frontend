import { z } from 'zod';

export const createMessageSchema = z.object({
  content: z.string().min(1, 'El mensaje no puede estar vacío').max(5000, 'Máximo 5000 caracteres'),
});

export const createConversationSchema = z.object({
  participantId: z.string().uuid('ID de participante inválido'),
});

export type CreateMessageFormData = z.infer<typeof createMessageSchema>;
export type CreateConversationFormData = z.infer<typeof createConversationSchema>;
