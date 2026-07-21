import { ListApiCredentialByOfficeIdUseCase } from './list-api-credential-by-office-id.use-case';
export declare class ListApiCredentialByOfficeIdController {
    private readonly listApiCredentialByOfficeIdUseCase;
    constructor(listApiCredentialByOfficeIdUseCase: ListApiCredentialByOfficeIdUseCase);
    handle(body: Record<string, unknown>): Promise<{
        status: string;
        message: string;
        data: {
            apiCredentials: Record<string, unknown>[];
            total: number;
        };
    }>;
}
