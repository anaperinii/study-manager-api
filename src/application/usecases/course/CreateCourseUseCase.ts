import Course from '../../../domain/entities/Course';
import type { ICourseRepository } from '../../../domain/repositories/ICourseRepository';
import type { CreateCourseInput } from '../../dtos/courseDTOs';

class CreateCourseUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute({ title, description, workload }: CreateCourseInput): Promise<Course> {
    const course = new Course({ title, description, workload });

    return this.courseRepository.create(course);
  }
}

export default CreateCourseUseCase;
