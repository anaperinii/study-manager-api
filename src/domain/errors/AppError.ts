export interface ErrorDetail {
  field: string;
  message: string;
}

class AppError extends Error {
  readonly statusCode: number;
  readonly details: ErrorDetail[] | null;
  readonly isOperational: boolean;

  constructor(message: string, statusCode = 400, details: ErrorDetail[] | null = null) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, new.target);
  }
}

export default AppError;
