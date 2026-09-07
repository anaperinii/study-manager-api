import type Course from '../../../domain/entities/Course';
import { NotFoundError } from '../../../domain/errors';
import type { ICourseRepository } from '../../../domain/repositories/ICourseRepository';

class GetCourseByIdUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(id: number): Promise<Course> {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    return course;
  }
}

export default GetCourseByIdUseCase;
