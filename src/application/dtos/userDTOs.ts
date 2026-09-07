import type { UserJSON } from '../../domain/entities/User';
import type { CourseJSON } from '../../domain/entities/Course';

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}

export interface EnrolledCourse extends CourseJSON {
  enrolled_at: Date | null;
}

export interface UserCoursesOutput {
  user: UserJSON;
  courses: EnrolledCourse[];
}
