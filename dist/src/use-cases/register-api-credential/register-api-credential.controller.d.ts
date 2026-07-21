import { RegisterApiCredentialRequest } from './http/register-api-credential.request';
import { RegisterApiCredentialUseCase } from './register-api-credential.use-case';
export declare class RegisterApiCredentialController {
    private readonly registerApiCredentialUseCase;
    constructor(registerApiCredentialUseCase: RegisterApiCredentialUseCase);
    handle(body: RegisterApiCredentialRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/register-api-credential.dto-out").RegisterApiCredentialDtoOut;
    }>;
}
