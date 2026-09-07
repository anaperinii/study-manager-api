import { Router } from 'express';
import type CourseController from '../controllers/CourseController';
import asyncHandler from '../middlewares/asyncHandler';
import validateRequest from '../middlewares/validateRequest';
import { idParamSchema } from '../validators/commonValidators';
import { createCourseSchema, updateCourseSchema } from '../validators/courseValidators';

function buildCourseRoutes(courseController: CourseController): Router {
  const routes = Router();
  const validateId = validateRequest(idParamSchema, 'params');

  routes.post('/', validateRequest(createCourseSchema), asyncHandler(courseController.create));
  routes.get('/', asyncHandler(courseController.list));
  routes.get('/:id', validateId, asyncHandler(courseController.show));
  routes.put(
    '/:id',
    validateId,
    validateRequest(updateCourseSchema),
    asyncHandler(courseController.update)
  );
  routes.delete('/:id', validateId, asyncHandler(courseController.destroy));

  return routes;
}

export default buildCourseRoutes;
