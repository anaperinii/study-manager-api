import type User from '../../../domain/entities/User';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';

class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}

export default ListUsersUseCase;
