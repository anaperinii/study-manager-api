import { Router } from 'express';
import type UserController from '../controllers/UserController';
import asyncHandler from '../middlewares/asyncHandler';
import validateRequest from '../middlewares/validateRequest';
import { idParamSchema } from '../validators/commonValidators';
import { createUserSchema, updateUserSchema } from '../validators/userValidators';

function buildUserRoutes(userController: UserController): Router {
  const routes = Router();
  const validateId = validateRequest(idParamSchema, 'params');

  routes.post('/', validateRequest(createUserSchema), asyncHandler(userController.create));
  routes.get('/', asyncHandler(userController.list));
  routes.get('/:id', validateId, asyncHandler(userController.show));
  routes.get('/:id/courses', validateId, asyncHandler(userController.listCourses));
  routes.put(
    '/:id',
    validateId,
    validateRequest(updateUserSchema),
    asyncHandler(userController.update)
  );
  routes.delete('/:id', validateId, asyncHandler(userController.destroy));

  return routes;
}

export default buildUserRoutes;
