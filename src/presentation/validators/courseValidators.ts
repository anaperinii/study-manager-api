import { z } from 'zod';

const titleSchema = z
  .string({ required_error: 'title is required', invalid_type_error: 'title must be a string' })
  .trim()
  .min(3, 'title must have at least 3 characters')
  .max(150, 'title must have at most 150 characters');

const descriptionSchema = z
  .string({
    required_error: 'description is required',
    invalid_type_error: 'description must be a string',
  })
  .trim()
  .min(10, 'description must have at least 10 characters')
  .max(1000, 'description must have at most 1000 characters');

const workloadSchema = z
  .number({ required_error: 'workload is required', invalid_type_error: 'workload must be a number' })
  .int('workload must be an integer')
  .positive('workload must be greater than zero')
  .max(10000, 'workload must be at most 10000 hours');

export const createCourseSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  workload: workloadSchema,
});

export const updateCourseSchema = z
  .object({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    workload: workloadSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'at least one field must be provided',
  });

export type CreateCourseBody = z.infer<typeof createCourseSchema>;
export type UpdateCourseBody = z.infer<typeof updateCourseSchema>;
