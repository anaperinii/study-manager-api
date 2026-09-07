import type Course from '../../../domain/entities/Course';
import { NotFoundError } from '../../../domain/errors';
import type {
  CourseUpdateData,
  ICourseRepository,
} from '../../../domain/repositories/ICourseRepository';
import type { UpdateCourseInput } from '../../dtos/courseDTOs';

class UpdateCourseUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(id: number, { title, description, workload }: UpdateCourseInput): Promise<Course> {
    await this.findCourseOrFail(id);
    const changes: CourseUpdateData = {};

    if (title !== undefined) changes.title = title.trim();
    if (description !== undefined) changes.description = description.trim();
    if (workload !== undefined) changes.workload = workload;

    return this.courseRepository.update(id, changes);
  }

  private async findCourseOrFail(id: number): Promise<Course> {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    return course;
  }
}

export default UpdateCourseUseCase;
