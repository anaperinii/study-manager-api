import type {
  Course as CourseRecord,
  Enrollment as EnrollmentRecord,
  User as UserRecord,
} from '@prisma/client';
import Enrollment from '../../domain/entities/Enrollment';
import CourseMapper from './CourseMapper';
import UserMapper from './UserMapper';

export type EnrollmentRecordWithRelations = EnrollmentRecord & {
  user?: UserRecord | null;
  course?: CourseRecord | null;
};

class EnrollmentMapper {
  static toDomain(record: EnrollmentRecordWithRelations): Enrollment {
    return new Enrollment({
      id: record.id,
      userId: record.userId,
      courseId: record.courseId,
      enrolledAt: record.enrolledAt,
      user: UserMapper.toDomainOrNull(record.user ?? null),
      course: CourseMapper.toDomainOrNull(record.course ?? null),
    });
  }

  static toDomainOrNull(record: EnrollmentRecordWithRelations | null): Enrollment | null {
    return record ? EnrollmentMapper.toDomain(record) : null;
  }

  static toDomainList(records: EnrollmentRecordWithRelations[]): Enrollment[] {
    return records.map(EnrollmentMapper.toDomain);
  }
}

export default EnrollmentMapper;
