import type User from '../entities/User';

export interface UserUpdateData {
  name?: string;
  email?: string;
}

export interface IUserRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByIdWithCourses(id: number): Promise<User | null>;
  update(id: number, data: UserUpdateData): Promise<User>;
  delete(id: number): Promise<void>;
}
