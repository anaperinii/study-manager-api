import type Course from './Course';
import type User from './User';
import type { CourseJSON } from './Course';
import type { UserJSON } from './User';

export interface EnrollmentProps {
  id?: number | null;
  userId: number;
  courseId: number;
  enrolledAt?: Date | null;
  user?: User | null;
  course?: Course | null;
}

export interface EnrollmentJSON {
  id: number | null;
  user_id: number;
  course_id: number;
  enrolled_at: Date | null;
  user?: UserJSON;
  course?: CourseJSON;
}

class Enrollment {
  readonly id: number | null;
  readonly userId: number;
  readonly courseId: number;
  readonly enrolledAt: Date | null;
  readonly user: User | null;
  readonly course: Course | null;

  constructor({
    id = null,
    userId,
    courseId,
    enrolledAt = null,
    user = null,
    course = null,
  }: EnrollmentProps) {
    this.id = id;
    this.userId = Number(userId);
    this.courseId = Number(courseId);
    this.enrolledAt = enrolledAt;
    this.user = user;
    this.course = course;
  }

  toJSON(): EnrollmentJSON {
    const payload: EnrollmentJSON = {
      id: this.id,
      user_id: this.userId,
      course_id: this.courseId,
      enrolled_at: this.enrolledAt,
    };

    if (this.user) payload.user = this.user.toJSON();
    if (this.course) payload.course = this.course.toJSON();

    return payload;
  }
}

export default Enrollment;
