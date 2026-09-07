import type { Request, Response } from 'express';
import type CreateUserUseCase from '../../application/usecases/user/CreateUserUseCase';
import type DeleteUserUseCase from '../../application/usecases/user/DeleteUserUseCase';
import type GetUserByIdUseCase from '../../application/usecases/user/GetUserByIdUseCase';
import type GetUserCoursesUseCase from '../../application/usecases/user/GetUserCoursesUseCase';
import type ListUsersUseCase from '../../application/usecases/user/ListUsersUseCase';
import type UpdateUserUseCase from '../../application/usecases/user/UpdateUserUseCase';
import ApiResponse from '../http/ApiResponse';
import { getIdParam } from '../http/requestParams';
import type { CreateUserBody, UpdateUserBody } from '../validators/userValidators';

export interface UserUseCases {
  createUserUseCase: CreateUserUseCase;
  listUsersUseCase: ListUsersUseCase;
  getUserByIdUseCase: GetUserByIdUseCase;
  updateUserUseCase: UpdateUserUseCase;
  deleteUserUseCase: DeleteUserUseCase;
  getUserCoursesUseCase: GetUserCoursesUseCase;
}

class UserController {
  constructor(private readonly useCases: UserUseCases) {}

  create = async (req: Request, res: Response): Promise<Response> => {
    const user = await this.useCases.createUserUseCase.execute(req.body as CreateUserBody);

    return ApiResponse.created(res, { message: 'User created successfully', data: user.toJSON() });
  };

  list = async (_req: Request, res: Response): Promise<Response> => {
    const users = await this.useCases.listUsersUseCase.execute();

    return ApiResponse.success(res, {
      message: 'Users retrieved successfully',
      data: users.map((user) => user.toJSON()),
    });
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    const user = await this.useCases.getUserByIdUseCase.execute(getIdParam(req));

    return ApiResponse.success(res, {
      message: 'User retrieved successfully',
      data: user.toJSON(),
    });
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const user = await this.useCases.updateUserUseCase.execute(
      getIdParam(req),
      req.body as UpdateUserBody
    );

    return ApiResponse.success(res, { message: 'User updated successfully', data: user.toJSON() });
  };

  destroy = async (req: Request, res: Response): Promise<Response> => {
    await this.useCases.deleteUserUseCase.execute(getIdParam(req));

    return ApiResponse.success(res, { message: 'User deleted successfully', data: null });
  };

  listCourses = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.useCases.getUserCoursesUseCase.execute(getIdParam(req));

    return ApiResponse.success(res, {
      message: 'User courses retrieved successfully',
      data: result,
    });
  };
}

export default UserController;
