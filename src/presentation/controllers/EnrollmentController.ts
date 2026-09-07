import type { Request, Response } from 'express';
import type CreateEnrollmentUseCase from '../../application/usecases/enrollment/CreateEnrollmentUseCase';
import type DeleteEnrollmentUseCase from '../../application/usecases/enrollment/DeleteEnrollmentUseCase';
import type ListEnrollmentsUseCase from '../../application/usecases/enrollment/ListEnrollmentsUseCase';
import ApiResponse from '../http/ApiResponse';
import { getIdParam } from '../http/requestParams';
import type { CreateEnrollmentBody } from '../validators/enrollmentValidators';

export interface EnrollmentUseCases {
  createEnrollmentUseCase: CreateEnrollmentUseCase;
  listEnrollmentsUseCase: ListEnrollmentsUseCase;
  deleteEnrollmentUseCase: DeleteEnrollmentUseCase;
}

class EnrollmentController {
  constructor(private readonly useCases: EnrollmentUseCases) {}

  create = async (req: Request, res: Response): Promise<Response> => {
    const body = req.body as CreateEnrollmentBody;
    const enrollment = await this.useCases.createEnrollmentUseCase.execute({
      userId: body.user_id,
      courseId: body.course_id,
    });

    return ApiResponse.created(res, {
      message: 'Enrollment created successfully',
      data: enrollment.toJSON(),
    });
  };

  list = async (_req: Request, res: Response): Promise<Response> => {
    const enrollments = await this.useCases.listEnrollmentsUseCase.execute();

    return ApiResponse.success(res, {
      message: 'Enrollments retrieved successfully',
      data: enrollments.map((enrollment) => enrollment.toJSON()),
    });
  };

  destroy = async (req: Request, res: Response): Promise<Response> => {
    await this.useCases.deleteEnrollmentUseCase.execute(getIdParam(req));

    return ApiResponse.success(res, { message: 'Enrollment deleted successfully', data: null });
  };
}

export default EnrollmentController;
