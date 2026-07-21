import { GetApiCredentialsByUniqueIdUseCase } from './get-api-credentials-by-unique-id.use-case';
export declare class GetApiCredentialsByUniqueIdController {
    private readonly getApiCredentialsByUniqueIdUseCase;
    constructor(getApiCredentialsByUniqueIdUseCase: GetApiCredentialsByUniqueIdUseCase);
    handle(body: Record<string, unknown>): Promise<{
        status: string;
        message: string;
        data: {
            apiCredential: Record<string, unknown>;
        };
    }>;
}
