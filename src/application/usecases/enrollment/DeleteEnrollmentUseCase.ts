import { NotFoundError } from '../../../domain/errors';
import type { IEnrollmentRepository } from '../../../domain/repositories/IEnrollmentRepository';

class DeleteEnrollmentUseCase {
  constructor(private readonly enrollmentRepository: IEnrollmentRepository) {}

  async execute(id: number): Promise<void> {
    const enrollment = await this.enrollmentRepository.findById(id);

    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    await this.enrollmentRepository.delete(id);
  }
}

export default DeleteEnrollmentUseCase;
