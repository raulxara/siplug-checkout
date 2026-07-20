import { BuildDecryptedApiCredentialResponseService } from '../../common/services/api-credentials/build-decrypted-api-credential-response/build-decrypted-api-credential-response.service';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';
import { GetApiCredentialsByUniqueIdDtoIn } from './dtos/get-api-credentials-by-unique-id.dto-in';
import { GetApiCredentialsByUniqueIdDtoOut } from './dtos/get-api-credentials-by-unique-id.dto-out';
export declare class GetApiCredentialsByUniqueIdUseCase {
    private readonly findApiCredentialByUniqueIdService;
    private readonly buildDecryptedApiCredentialResponseService;
    private readonly handleUseCaseExceptionService;
    constructor(findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService, buildDecryptedApiCredentialResponseService: BuildDecryptedApiCredentialResponseService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: GetApiCredentialsByUniqueIdDtoIn): Promise<GetApiCredentialsByUniqueIdDtoOut>;
}
