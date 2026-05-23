import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Digite um email valido.'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres.'),
});

export const signupSchema = z
  .object({
    email: z.email('Digite um email valido.'),
    password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres.'),
    confirmPassword: z.string().min(6, 'Confirme a senha.'),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'As senhas precisam ser iguais.',
    path: ['confirmPassword'],
  });
