import type { Request, Response } from 'express';
import type CreateCourseUseCase from '../../application/usecases/course/CreateCourseUseCase';
import type DeleteCourseUseCase from '../../application/usecases/course/DeleteCourseUseCase';
import type GetCourseByIdUseCase from '../../application/usecases/course/GetCourseByIdUseCase';
import type ListCoursesUseCase from '../../application/usecases/course/ListCoursesUseCase';
import type UpdateCourseUseCase from '../../application/usecases/course/UpdateCourseUseCase';
import ApiResponse from '../http/ApiResponse';
import { getIdParam } from '../http/requestParams';
import type { CreateCourseBody, UpdateCourseBody } from '../validators/courseValidators';

export interface CourseUseCases {
  createCourseUseCase: CreateCourseUseCase;
  listCoursesUseCase: ListCoursesUseCase;
  getCourseByIdUseCase: GetCourseByIdUseCase;
  updateCourseUseCase: UpdateCourseUseCase;
  deleteCourseUseCase: DeleteCourseUseCase;
}

class CourseController {
  constructor(private readonly useCases: CourseUseCases) {}

  create = async (req: Request, res: Response): Promise<Response> => {
    const course = await this.useCases.createCourseUseCase.execute(req.body as CreateCourseBody);

    return ApiResponse.created(res, {
      message: 'Course created successfully',
      data: course.toJSON(),
    });
  };

  list = async (_req: Request, res: Response): Promise<Response> => {
    const courses = await this.useCases.listCoursesUseCase.execute();

    return ApiResponse.success(res, {
      message: 'Courses retrieved successfully',
      data: courses.map((course) => course.toJSON()),
    });
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    const course = await this.useCases.getCourseByIdUseCase.execute(getIdParam(req));

    return ApiResponse.success(res, {
      message: 'Course retrieved successfully',
      data: course.toJSON(),
    });
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const course = await this.useCases.updateCourseUseCase.execute(
      getIdParam(req),
      req.body as UpdateCourseBody
    );

    return ApiResponse.success(res, {
      message: 'Course updated successfully',
      data: course.toJSON(),
    });
  };

  destroy = async (req: Request, res: Response): Promise<Response> => {
    await this.useCases.deleteCourseUseCase.execute(getIdParam(req));

    return ApiResponse.success(res, { message: 'Course deleted successfully', data: null });
  };
}

export default CourseController;
