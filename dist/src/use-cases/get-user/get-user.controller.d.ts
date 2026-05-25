import { GetUserRequest } from './http/get-user.request';
import { GetUserUseCase } from './get-user.use-case';
export declare class GetUserController {
    private readonly getUserUseCase;
    constructor(getUserUseCase: GetUserUseCase);
    handle(body: GetUserRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/get-user.dto-out").GetUserDtoOut;
    }>;
}
