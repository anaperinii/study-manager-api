import type Enrollment from '../../../domain/entities/Enrollment';
import type { IEnrollmentRepository } from '../../../domain/repositories/IEnrollmentRepository';

class ListEnrollmentsUseCase {
  constructor(private readonly enrollmentRepository: IEnrollmentRepository) {}

  async execute(): Promise<Enrollment[]> {
    return this.enrollmentRepository.findAll();
  }
}

export default ListEnrollmentsUseCase;
