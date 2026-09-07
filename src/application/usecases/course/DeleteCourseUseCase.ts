import { NotFoundError } from '../../../domain/errors';
import type { ICourseRepository } from '../../../domain/repositories/ICourseRepository';

class DeleteCourseUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(id: number): Promise<void> {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    await this.courseRepository.delete(id);
  }
}

export default DeleteCourseUseCase;
