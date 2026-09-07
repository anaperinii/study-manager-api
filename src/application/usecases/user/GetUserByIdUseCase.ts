import type User from '../../../domain/entities/User';
import { NotFoundError } from '../../../domain/errors';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';

class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}

export default GetUserByIdUseCase;
