import AppError from './AppError';

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

export default ConflictError;
