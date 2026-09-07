import { NotFoundError } from '../../../domain/errors';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';

class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    await this.userRepository.delete(id);
  }
}

export default DeleteUserUseCase;
