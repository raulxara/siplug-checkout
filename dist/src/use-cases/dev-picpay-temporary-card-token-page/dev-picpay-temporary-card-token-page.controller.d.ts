import type { Response } from 'express';
import { DevPicPayTemporaryCardTokenPageUseCase } from './dev-picpay-temporary-card-token-page.use-case';
export declare class DevPicPayTemporaryCardTokenPageController {
    private readonly devPicPayTemporaryCardTokenPageUseCase;
    constructor(devPicPayTemporaryCardTokenPageUseCase: DevPicPayTemporaryCardTokenPageUseCase);
    page(apiCredentialId: string, response: Response): Promise<void>;
}
