import type { RequestHandler } from 'express';
import type { ZodError, ZodTypeAny } from 'zod';
import { ValidationError } from '../../domain/errors';
import type { ErrorDetail } from '../../domain/errors';

type RequestSource = 'body' | 'params' | 'query';

function validateRequest(schema: ZodTypeAny, source: RequestSource = 'body'): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(new ValidationError('Invalid request data', formatIssues(result.error)));
    }

    (req as Record<RequestSource, unknown>)[source] = result.data;
    return next();
  };
}

function formatIssues(error: ZodError): ErrorDetail[] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || '(root)',
    message: issue.message,
  }));
}

export default validateRequest;
