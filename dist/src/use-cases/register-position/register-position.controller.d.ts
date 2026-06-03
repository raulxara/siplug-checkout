import { RegisterPositionRequest } from './http/register-position.request';
import { RegisterPositionUseCase } from './register-position.use-case';
export declare class RegisterPositionController {
    private readonly registerPositionUseCase;
    constructor(registerPositionUseCase: RegisterPositionUseCase);
    handle(body: RegisterPositionRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/register-position.dto-out").RegisterPositionDtoOut;
    }>;
}
