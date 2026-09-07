import Enrollment from '../../../domain/entities/Enrollment';
import { ConflictError, NotFoundError } from '../../../domain/errors';
import type { ICourseRepository } from '../../../domain/repositories/ICourseRepository';
import type { IEnrollmentRepository } from '../../../domain/repositories/IEnrollmentRepository';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';
import type { CreateEnrollmentInput } from '../../dtos/enrollmentDTOs';

class CreateEnrollmentUseCase {
  constructor(
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly userRepository: IUserRepository,
    private readonly courseRepository: ICourseRepository
  ) {}

  async execute({ userId, courseId }: CreateEnrollmentInput): Promise<Enrollment> {
    const enrollment = new Enrollment({ userId, courseId });

    await this.ensureUserExists(enrollment.userId);
    await this.ensureCourseExists(enrollment.courseId);
    await this.ensureEnrollmentIsNotDuplicated(enrollment.userId, enrollment.courseId);

    return this.enrollmentRepository.create(enrollment);
  }

  private async ensureUserExists(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }
  }

  private async ensureCourseExists(courseId: number): Promise<void> {
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundError('Course not found');
    }
  }

  private async ensureEnrollmentIsNotDuplicated(userId: number, courseId: number): Promise<void> {
    const existingEnrollment = await this.enrollmentRepository.findByUserAndCourse(userId, courseId);

    if (existingEnrollment) {
      throw new ConflictError('User is already enrolled in this course');
    }
  }
}

export default CreateEnrollmentUseCase;
