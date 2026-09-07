import { Router } from 'express';
import type { Container } from '../../container';
import ApiResponse from '../http/ApiResponse';
import buildCourseRoutes from './courseRoutes';
import buildEnrollmentRoutes from './enrollmentRoutes';
import buildUserRoutes from './userRoutes';

function buildRoutes({ userController, courseController, enrollmentController }: Container): Router {
  const routes = Router();

  routes.get('/health', (_req, res) => {
    ApiResponse.success(res, {
      message: 'StudyManager API is running',
      data: { status: 'ok' },
    });
  });

  routes.use('/users', buildUserRoutes(userController));
  routes.use('/courses', buildCourseRoutes(courseController));
  routes.use('/enrollments', buildEnrollmentRoutes(enrollmentController));

  return routes;
}

export default buildRoutes;
