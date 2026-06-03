import { RegisterPermissionRequest } from './http/register-permission.request';
import { RegisterPermissionUseCase } from './register-permission.use-case';
export declare class RegisterPermissionController {
    private readonly registerPermissionUseCase;
    constructor(registerPermissionUseCase: RegisterPermissionUseCase);
    handle(body: RegisterPermissionRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/register-permission.dto-out").RegisterPermissionDtoOut;
    }>;
}
