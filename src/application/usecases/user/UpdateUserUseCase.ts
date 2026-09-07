import User from '../../../domain/entities/User';
import { ConflictError, NotFoundError } from '../../../domain/errors';
import type { IUserRepository, UserUpdateData } from '../../../domain/repositories/IUserRepository';
import type { UpdateUserInput } from '../../dtos/userDTOs';

class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number, { name, email }: UpdateUserInput): Promise<User> {
    await this.findUserOrFail(id);
    const changes: UserUpdateData = {};

    if (name !== undefined) {
      changes.name = User.normalizeName(name);
    }

    if (email !== undefined) {
      const normalizedEmail = User.normalizeEmail(email);
      await this.ensureEmailIsAvailable(normalizedEmail, id);
      changes.email = normalizedEmail;
    }

    return this.userRepository.update(id, changes);
  }

  private async findUserOrFail(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  private async ensureEmailIsAvailable(email: string, currentUserId: number): Promise<void> {
    const owner = await this.userRepository.findByEmail(email);

    if (owner && owner.id !== currentUserId) {
      throw new ConflictError('Email already registered');
    }
  }
}

export default UpdateUserUseCase;
