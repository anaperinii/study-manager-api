import { Router } from 'express';
import type EnrollmentController from '../controllers/EnrollmentController';
import asyncHandler from '../middlewares/asyncHandler';
import validateRequest from '../middlewares/validateRequest';
import { idParamSchema } from '../validators/commonValidators';
import { createEnrollmentSchema } from '../validators/enrollmentValidators';

function buildEnrollmentRoutes(enrollmentController: EnrollmentController): Router {
  const routes = Router();

  routes.post(
    '/',
    validateRequest(createEnrollmentSchema),
    asyncHandler(enrollmentController.create)
  );
  routes.get('/', asyncHandler(enrollmentController.list));
  routes.delete(
    '/:id',
    validateRequest(idParamSchema, 'params'),
    asyncHandler(enrollmentController.destroy)
  );

  return routes;
}

export default buildEnrollmentRoutes;
