import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';
import { DevPagSeguroEncryptedCardPageDtoIn } from './dtos/dev-pagseguro-encrypted-card-page.dto-in';
import { DevPagSeguroEncryptedCardPageDtoOut } from './dtos/dev-pagseguro-encrypted-card-page.dto-out';
export declare class DevPagSeguroEncryptedCardPageUseCase {
    private readonly findApiCredentialByUniqueIdService;
    constructor(findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService);
    exec(dtoIn: DevPagSeguroEncryptedCardPageDtoIn): Promise<DevPagSeguroEncryptedCardPageDtoOut>;
    private ensureNonProductionEnvironment;
    private resolvePublicKey;
    private buildHtmlPage;
    private toNullableString;
}
