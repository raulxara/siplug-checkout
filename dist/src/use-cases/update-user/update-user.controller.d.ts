import { UpdateUserRequest } from './http/update-user.request';
import { UpdateUserUseCase } from './update-user.use-case';
export declare class UpdateUserController {
    private readonly updateUserUseCase;
    constructor(updateUserUseCase: UpdateUserUseCase);
    handle(body: UpdateUserRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/update-user.dto-out").UpdateUserDtoOut;
    }>;
}
