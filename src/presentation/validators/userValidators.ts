import { z } from 'zod';

const nameSchema = z
  .string({ required_error: 'name is required', invalid_type_error: 'name must be a string' })
  .trim()
  .min(3, 'name must have at least 3 characters')
  .max(120, 'name must have at most 120 characters');

const emailSchema = z
  .string({ required_error: 'email is required', invalid_type_error: 'email must be a string' })
  .trim()
  .email('email must be a valid address')
  .max(180, 'email must have at most 180 characters');

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
});

export const updateUserSchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'at least one field must be provided',
  });

export type CreateUserBody = z.infer<typeof createUserSchema>;
export type UpdateUserBody = z.infer<typeof updateUserSchema>;
