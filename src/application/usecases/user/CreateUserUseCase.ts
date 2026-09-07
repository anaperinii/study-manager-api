import User from '../../../domain/entities/User';
import { ConflictError } from '../../../domain/errors';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';
import type { CreateUserInput } from '../../dtos/userDTOs';

class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({ name, email }: CreateUserInput): Promise<User> {
    const user = new User({ name, email });

    await this.ensureEmailIsAvailable(user.email);

    return this.userRepository.create(user);
  }

  private async ensureEmailIsAvailable(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }
  }
}

export default CreateUserUseCase;
