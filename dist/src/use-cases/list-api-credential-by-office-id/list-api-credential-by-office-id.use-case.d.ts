import { BuildDecryptedApiCredentialResponseService } from '../../common/services/api-credentials/build-decrypted-api-credential-response/build-decrypted-api-credential-response.service';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { ListApiCredentialsByOfficeIdService } from '../../modules/api-credentials/services/list-api-credentials-by-office-id/list-api-credentials-by-office-id.service';
import { ListApiCredentialByOfficeIdDtoIn } from './dtos/list-api-credential-by-office-id.dto-in';
import { ListApiCredentialByOfficeIdDtoOut } from './dtos/list-api-credential-by-office-id.dto-out';
export declare class ListApiCredentialByOfficeIdUseCase {
    private readonly listApiCredentialsByOfficeIdService;
    private readonly buildDecryptedApiCredentialResponseService;
    private readonly handleUseCaseExceptionService;
    constructor(listApiCredentialsByOfficeIdService: ListApiCredentialsByOfficeIdService, buildDecryptedApiCredentialResponseService: BuildDecryptedApiCredentialResponseService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: ListApiCredentialByOfficeIdDtoIn): Promise<ListApiCredentialByOfficeIdDtoOut>;
}
