import { UpdateApiCredentialRequest } from './http/update-api-credential.request';
import { UpdateApiCredentialUseCase } from './update-api-credential.use-case';
export declare class UpdateApiCredentialController {
    private readonly updateApiCredentialUseCase;
    constructor(updateApiCredentialUseCase: UpdateApiCredentialUseCase);
    handle(body: UpdateApiCredentialRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/update-api-credential.dto-out").UpdateApiCredentialDtoOut;
    }>;
}
