import { z } from 'zod';

export const bookStatusSchema = z.enum(['want_to_read', 'reading', 'completed']);
const bookDateInputSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe uma data valida.')
  .nullable()
  .optional();

export const bookReviewSchema = z.object({
  rating: z.number().min(0).max(5).nullable().optional(),
  review: z.string().max(5000, 'Use no maximo 5000 caracteres.').nullable().optional(),
  started_at: z.string().datetime({ offset: true }).nullable().optional(),
  completed_at: z.string().datetime({ offset: true }).nullable().optional(),
});

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
  started_at: bookDateInputSchema,
  completed_at: bookDateInputSchema,
  rating: z.number().int().min(1).max(5).nullable().optional(),
  review: z.string().max(5000, 'Use no maximo 5000 caracteres.').nullable().optional(),
});
