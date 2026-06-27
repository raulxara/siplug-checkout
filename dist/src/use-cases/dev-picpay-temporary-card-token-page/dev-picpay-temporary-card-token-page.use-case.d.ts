import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';
import { DevPicPayTemporaryCardTokenPageDtoIn } from './dtos/dev-picpay-temporary-card-token-page.dto-in';
import { DevPicPayTemporaryCardTokenPageDtoOut } from './dtos/dev-picpay-temporary-card-token-page.dto-out';
export declare class DevPicPayTemporaryCardTokenPageUseCase {
    private readonly findApiCredentialByUniqueIdService;
    constructor(findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService);
    exec(dtoIn: DevPicPayTemporaryCardTokenPageDtoIn): Promise<DevPicPayTemporaryCardTokenPageDtoOut>;
    private ensureNonProductionEnvironment;
    private resolveMerchantCredential;
    private resolveTransparentToken;
    private resolveEnvironment;
    private resolveSdkUrls;
    private resolveConfiguredSdkUrls;
    private buildHtmlPage;
    private toRecordOrNull;
    private toNullableString;
}
