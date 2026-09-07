import AppError from './AppError';
import type { ErrorDetail } from './AppError';

class ValidationError extends AppError {
  constructor(message = 'Invalid request data', details: ErrorDetail[] | null = null) {
    super(message, 422, details);
  }
}

export default ValidationError;
