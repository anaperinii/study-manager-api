import type { Response } from 'express';
import type { ErrorDetail } from '../../domain/errors';

export interface SuccessBody<T> {
  success: true;
  message: string;
  data: T;
}

export interface ErrorBody {
  success: false;
  message: string;
  data: null;
  errors?: ErrorDetail[];
}

interface SuccessOptions<T> {
  statusCode?: number;
  message?: string;
  data?: T;
}

interface CreatedOptions<T> {
  message: string;
  data: T;
}

interface ErrorOptions {
  statusCode?: number;
  message?: string;
  details?: ErrorDetail[] | null;
}

class ApiResponse {
  static success<T>(
    res: Response,
    { statusCode = 200, message = 'Operation completed successfully', data = null as T }: SuccessOptions<T>
  ): Response<SuccessBody<T>> {
    return res.status(statusCode).json({ success: true, message, data });
  }

  static created<T>(res: Response, { message, data }: CreatedOptions<T>): Response<SuccessBody<T>> {
    return ApiResponse.success(res, { statusCode: 201, message, data });
  }

  static error(
    res: Response,
    { statusCode = 500, message = 'Internal server error', details = null }: ErrorOptions
  ): Response<ErrorBody> {
    const body: ErrorBody = { success: false, message, data: null };

    if (details) body.errors = details;

    return res.status(statusCode).json(body);
  }
}

export default ApiResponse;
