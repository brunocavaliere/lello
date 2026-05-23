import { z } from 'zod';

export const bookStatusSchema = z.enum(['want_to_read', 'reading', 'completed']);

export const createBookSchema = z.object({
  title: z
    .string()
    .min(2, 'Informe um titulo com pelo menos 2 caracteres.')
    .max(120, 'Use no maximo 120 caracteres no titulo.'),
  author: z
    .string()
    .min(2, 'Informe o nome do autor com pelo menos 2 caracteres.')
    .max(120, 'Use no maximo 120 caracteres no nome do autor.'),
  status: bookStatusSchema,
  description: z.string().max(4000).optional().nullable(),
  cover_url: z.string().url().optional().nullable(),
  publisher: z.string().max(160).optional().nullable(),
  published_at: z.string().max(20).optional().nullable(),
});
