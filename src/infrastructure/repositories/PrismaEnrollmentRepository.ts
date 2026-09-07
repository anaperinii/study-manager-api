import type { PrismaClient } from '@prisma/client';
import type Enrollment from '../../domain/entities/Enrollment';
import type { IEnrollmentRepository } from '../../domain/repositories/IEnrollmentRepository';
import EnrollmentMapper from '../mappers/EnrollmentMapper';

class PrismaEnrollmentRepository implements IEnrollmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(enrollment: Enrollment): Promise<Enrollment> {
    const record = await this.prisma.enrollment.create({
      data: { userId: enrollment.userId, courseId: enrollment.courseId },
      include: { user: true, course: true },
    });

    return EnrollmentMapper.toDomain(record);
  }

  async findAll(): Promise<Enrollment[]> {
    const records = await this.prisma.enrollment.findMany({
      include: { user: true, course: true },
      orderBy: { id: 'asc' },
    });

    return EnrollmentMapper.toDomainList(records);
  }

  async findById(id: number): Promise<Enrollment | null> {
    const record = await this.prisma.enrollment.findUnique({
      where: { id },
      include: { user: true, course: true },
    });

    return EnrollmentMapper.toDomainOrNull(record);
  }

  async findByUserAndCourse(userId: number, courseId: number): Promise<Enrollment | null> {
    const record = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    return EnrollmentMapper.toDomainOrNull(record);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.enrollment.delete({ where: { id } });
  }
}

export default PrismaEnrollmentRepository;
