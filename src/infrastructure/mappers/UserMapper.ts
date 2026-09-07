import type {
  Course as CourseRecord,
  Enrollment as EnrollmentRecord,
  User as UserRecord,
} from '@prisma/client';
import Enrollment from '../../domain/entities/Enrollment';
import User from '../../domain/entities/User';
import CourseMapper from './CourseMapper';

type EnrollmentWithCourseRecord = EnrollmentRecord & { course?: CourseRecord | null };

export type UserRecordWithRelations = UserRecord & {
  enrollments?: EnrollmentWithCourseRecord[];
};

class UserMapper {
  static toDomain(record: UserRecordWithRelations): User {
    return new User({
      id: record.id,
      name: record.name,
      email: record.email,
      createdAt: record.createdAt,
      enrollments: (record.enrollments ?? []).map(UserMapper.toEnrollment),
    });
  }

  static toDomainOrNull(record: UserRecordWithRelations | null): User | null {
    return record ? UserMapper.toDomain(record) : null;
  }

  static toDomainList(records: UserRecordWithRelations[]): User[] {
    return records.map(UserMapper.toDomain);
  }

  private static toEnrollment(record: EnrollmentWithCourseRecord): Enrollment {
    return new Enrollment({
      id: record.id,
      userId: record.userId,
      courseId: record.courseId,
      enrolledAt: record.enrolledAt,
      course: CourseMapper.toDomainOrNull(record.course ?? null),
    });
  }
}

export default UserMapper;
