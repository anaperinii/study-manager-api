import type { PrismaClient } from '@prisma/client';
import type User from '../../domain/entities/User';
import type { IUserRepository, UserUpdateData } from '../../domain/repositories/IUserRepository';
import UserMapper from '../mappers/UserMapper';

class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const record = await this.prisma.user.create({
      data: { name: user.name, email: user.email },
    });

    return UserMapper.toDomain(record);
  }

  async findAll(): Promise<User[]> {
    const records = await this.prisma.user.findMany({ orderBy: { id: 'asc' } });

    return UserMapper.toDomainList(records);
  }

  async findById(id: number): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });

    return UserMapper.toDomainOrNull(record);
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });

    return UserMapper.toDomainOrNull(record);
  }

  async findByIdWithCourses(id: number): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: { course: true },
          orderBy: { enrolledAt: 'asc' },
        },
      },
    });

    return UserMapper.toDomainOrNull(record);
  }

  async update(id: number, data: UserUpdateData): Promise<User> {
    const record = await this.prisma.user.update({ where: { id }, data });

    return UserMapper.toDomain(record);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}

export default PrismaUserRepository;
