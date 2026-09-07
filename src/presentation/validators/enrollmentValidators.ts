import { z } from 'zod';

const identifierSchema = (field: string) =>
  z
    .number({
      required_error: `${field} is required`,
      invalid_type_error: `${field} must be a number`,
    })
    .int(`${field} must be an integer`)
    .positive(`${field} must be greater than zero`);

export const createEnrollmentSchema = z.object({
  user_id: identifierSchema('user_id'),
  course_id: identifierSchema('course_id'),
});

export type CreateEnrollmentBody = z.infer<typeof createEnrollmentSchema>;
