import { RegisterUserRequest } from './http/register-user.request';
import { RegisterUserUseCase } from './register-user.use-case';
export declare class RegisterUserController {
    private readonly registerUserUseCase;
    constructor(registerUserUseCase: RegisterUserUseCase);
    handle(body: RegisterUserRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/register-user.dto-out").RegisterUserDtoOut;
    }>;
}
