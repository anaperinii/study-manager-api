import type { Course as CourseRecord } from '@prisma/client';
import Course from '../../domain/entities/Course';

class CourseMapper {
  static toDomain(record: CourseRecord): Course {
    return new Course({
      id: record.id,
      title: record.title,
      description: record.description,
      workload: record.workload,
    });
  }

  static toDomainOrNull(record: CourseRecord | null): Course | null {
    return record ? CourseMapper.toDomain(record) : null;
  }

  static toDomainList(records: CourseRecord[]): Course[] {
    return records.map(CourseMapper.toDomain);
  }
}

export default CourseMapper;
