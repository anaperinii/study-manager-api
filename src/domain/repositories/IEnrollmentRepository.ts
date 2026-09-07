import type Enrollment from '../entities/Enrollment';

export interface IEnrollmentRepository {
  create(enrollment: Enrollment): Promise<Enrollment>;
  findAll(): Promise<Enrollment[]>;
  findById(id: number): Promise<Enrollment | null>;
  findByUserAndCourse(userId: number, courseId: number): Promise<Enrollment | null>;
  delete(id: number): Promise<void>;
}
