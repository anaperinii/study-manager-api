import { Prisma } from '@prisma/client';
import type { ErrorRequestHandler } from 'express';
import { AppError, ConflictError, NotFoundError } from '../../domain/errors';
import ApiResponse from '../http/ApiResponse';

const PRISMA_UNIQUE_CONSTRAINT = 'P2002';
const PRISMA_RECORD_NOT_FOUND = 'P2025';
const PRISMA_FOREIGN_KEY_CONSTRAINT = 'P2003';

const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  const applicationError = toApplicationError(error);

  if (!applicationError.isOperational) {
    console.error('[unhandled-error]', error);
  }

  ApiResponse.error(res, {
    statusCode: applicationError.statusCode,
    message: applicationError.message,
    details: applicationError.details,
  });
};

function toApplicationError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Prisma.PrismaClientKnownRequestError) return fromPrismaError(error);
  if (isMalformedJson(error)) return new AppError('Malformed JSON body', 400);

  return new AppError('Internal server error', 500);
}

function fromPrismaError(error: Prisma.PrismaClientKnownRequestError): AppError {
  switch (error.code) {
    case PRISMA_UNIQUE_CONSTRAINT:
      return new ConflictError(`${describeTarget(error)} already in use`);
    case PRISMA_RECORD_NOT_FOUND:
      return new NotFoundError('Resource not found');
    case PRISMA_FOREIGN_KEY_CONSTRAINT:
      return new AppError('Related resource does not exist', 400);
    default:
      return new AppError('Database operation failed', 500);
  }
}

function describeTarget(error: Prisma.PrismaClientKnownRequestError): string {
  const target = error.meta?.['target'];

  if (Array.isArray(target)) return target.join(', ');
  if (typeof target === 'string') return target;

  return 'Field';
}

function isMalformedJson(error: unknown): boolean {
  return error instanceof SyntaxError && 'body' in error;
}

export default errorHandler;
