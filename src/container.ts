import CreateCourseUseCase from './application/usecases/course/CreateCourseUseCase';
import DeleteCourseUseCase from './application/usecases/course/DeleteCourseUseCase';
import GetCourseByIdUseCase from './application/usecases/course/GetCourseByIdUseCase';
import ListCoursesUseCase from './application/usecases/course/ListCoursesUseCase';
import UpdateCourseUseCase from './application/usecases/course/UpdateCourseUseCase';

import CreateEnrollmentUseCase from './application/usecases/enrollment/CreateEnrollmentUseCase';
import DeleteEnrollmentUseCase from './application/usecases/enrollment/DeleteEnrollmentUseCase';
import ListEnrollmentsUseCase from './application/usecases/enrollment/ListEnrollmentsUseCase';

import CreateUserUseCase from './application/usecases/user/CreateUserUseCase';
import DeleteUserUseCase from './application/usecases/user/DeleteUserUseCase';
import GetUserByIdUseCase from './application/usecases/user/GetUserByIdUseCase';
import GetUserCoursesUseCase from './application/usecases/user/GetUserCoursesUseCase';
import ListUsersUseCase from './application/usecases/user/ListUsersUseCase';
import UpdateUserUseCase from './application/usecases/user/UpdateUserUseCase';

import { prisma } from './infrastructure/database/prismaClient';
import PrismaCourseRepository from './infrastructure/repositories/PrismaCourseRepository';
import PrismaEnrollmentRepository from './infrastructure/repositories/PrismaEnrollmentRepository';
import PrismaUserRepository from './infrastructure/repositories/PrismaUserRepository';

import CourseController from './presentation/controllers/CourseController';
import EnrollmentController from './presentation/controllers/EnrollmentController';
import UserController from './presentation/controllers/UserController';

export interface Container {
  userController: UserController;
  courseController: CourseController;
  enrollmentController: EnrollmentController;
}

function buildContainer(): Container {
  const userRepository = new PrismaUserRepository(prisma);
  const courseRepository = new PrismaCourseRepository(prisma);
  const enrollmentRepository = new PrismaEnrollmentRepository(prisma);

  const userController = new UserController({
    createUserUseCase: new CreateUserUseCase(userRepository),
    listUsersUseCase: new ListUsersUseCase(userRepository),
    getUserByIdUseCase: new GetUserByIdUseCase(userRepository),
    updateUserUseCase: new UpdateUserUseCase(userRepository),
    deleteUserUseCase: new DeleteUserUseCase(userRepository),
    getUserCoursesUseCase: new GetUserCoursesUseCase(userRepository),
  });

  const courseController = new CourseController({
    createCourseUseCase: new CreateCourseUseCase(courseRepository),
    listCoursesUseCase: new ListCoursesUseCase(courseRepository),
    getCourseByIdUseCase: new GetCourseByIdUseCase(courseRepository),
    updateCourseUseCase: new UpdateCourseUseCase(courseRepository),
    deleteCourseUseCase: new DeleteCourseUseCase(courseRepository),
  });

  const enrollmentController = new EnrollmentController({
    createEnrollmentUseCase: new CreateEnrollmentUseCase(
      enrollmentRepository,
      userRepository,
      courseRepository
    ),
    listEnrollmentsUseCase: new ListEnrollmentsUseCase(enrollmentRepository),
    deleteEnrollmentUseCase: new DeleteEnrollmentUseCase(enrollmentRepository),
  });

  return { userController, courseController, enrollmentController };
}

export default buildContainer;
