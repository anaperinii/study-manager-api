import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().regex(/^[1-9]\d*$/, 'id must be a positive integer'),
});
