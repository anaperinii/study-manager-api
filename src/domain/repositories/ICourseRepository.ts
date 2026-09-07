import type Course from '../entities/Course';

export interface CourseUpdateData {
  title?: string;
  description?: string;
  workload?: number;
}

export interface ICourseRepository {
  create(course: Course): Promise<Course>;
  findAll(): Promise<Course[]>;
  findById(id: number): Promise<Course | null>;
  findByTitle(title: string): Promise<Course | null>;
  update(id: number, data: CourseUpdateData): Promise<Course>;
  delete(id: number): Promise<void>;
}
