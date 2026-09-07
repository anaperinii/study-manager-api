import type Course from '../../../domain/entities/Course';
import type Enrollment from '../../../domain/entities/Enrollment';
import { NotFoundError } from '../../../domain/errors';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';
import type { UserCoursesOutput } from '../../dtos/userDTOs';

type EnrollmentWithCourse = Enrollment & { course: Course };

class GetUserCoursesUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<UserCoursesOutput> {
    const user = await this.userRepository.findByIdWithCourses(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      user: user.toJSON(),
      courses: user.enrollments.filter(hasCourse).map((enrollment) => ({
        ...enrollment.course.toJSON(),
        enrolled_at: enrollment.enrolledAt,
      })),
    };
  }
}

function hasCourse(enrollment: Enrollment): enrollment is EnrollmentWithCourse {
  return enrollment.course !== null;
}

export default GetUserCoursesUseCase;
