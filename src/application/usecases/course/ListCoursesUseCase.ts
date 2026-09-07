import type Course from '../../../domain/entities/Course';
import type { ICourseRepository } from '../../../domain/repositories/ICourseRepository';

class ListCoursesUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(): Promise<Course[]> {
    return this.courseRepository.findAll();
  }
}

export default ListCoursesUseCase;
