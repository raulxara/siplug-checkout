import type { Response } from 'express';
import { DevPagSeguroEncryptedCardPageUseCase } from './dev-pagseguro-encrypted-card-page.use-case';
export declare class DevPagSeguroEncryptedCardPageController {
    private readonly devPagSeguroEncryptedCardPageUseCase;
    constructor(devPagSeguroEncryptedCardPageUseCase: DevPagSeguroEncryptedCardPageUseCase);
    page(apiCredentialId: string, response: Response): Promise<void>;
}
