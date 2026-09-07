import type Enrollment from './Enrollment';

export interface UserProps {
  id?: number | null;
  name: string;
  email: string;
  createdAt?: Date | null;
  enrollments?: Enrollment[];
}

export interface UserJSON {
  id: number | null;
  name: string;
  email: string;
  created_at: Date | null;
}

class User {
  readonly id: number | null;
  readonly name: string;
  readonly email: string;
  readonly createdAt: Date | null;
  readonly enrollments: Enrollment[];

  constructor({ id = null, name, email, createdAt = null, enrollments = [] }: UserProps) {
    this.id = id;
    this.name = User.normalizeName(name);
    this.email = User.normalizeEmail(email);
    this.createdAt = createdAt;
    this.enrollments = enrollments;
  }

  static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  static normalizeName(name: string): string {
    return name.trim();
  }

  toJSON(): UserJSON {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      created_at: this.createdAt,
    };
  }
}

export default User;
