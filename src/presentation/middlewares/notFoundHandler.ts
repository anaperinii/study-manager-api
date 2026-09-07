import type { RequestHandler } from 'express';
import ApiResponse from '../http/ApiResponse';

const notFoundHandler: RequestHandler = (req, res) => {
  ApiResponse.error(res, {
    statusCode: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

export default notFoundHandler;
