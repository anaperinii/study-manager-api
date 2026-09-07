import type { PrismaClient } from '@prisma/client';
import type Course from '../../domain/entities/Course';
import type {
  CourseUpdateData,
  ICourseRepository,
} from '../../domain/repositories/ICourseRepository';
import CourseMapper from '../mappers/CourseMapper';

class PrismaCourseRepository implements ICourseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(course: Course): Promise<Course> {
    const record = await this.prisma.course.create({
      data: {
        title: course.title,
        description: course.description,
        workload: course.workload,
      },
    });

    return CourseMapper.toDomain(record);
  }

  async findAll(): Promise<Course[]> {
    const records = await this.prisma.course.findMany({ orderBy: { id: 'asc' } });

    return CourseMapper.toDomainList(records);
  }

  async findById(id: number): Promise<Course | null> {
    const record = await this.prisma.course.findUnique({ where: { id } });

    return CourseMapper.toDomainOrNull(record);
  }

  async findByTitle(title: string): Promise<Course | null> {
    const record = await this.prisma.course.findFirst({ where: { title } });

    return CourseMapper.toDomainOrNull(record);
  }

  async update(id: number, data: CourseUpdateData): Promise<Course> {
    const record = await this.prisma.course.update({ where: { id }, data });

    return CourseMapper.toDomain(record);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.course.delete({ where: { id } });
  }
}

export default PrismaCourseRepository;
