import { Injectable } from '@nestjs/common';

import { BuildDecryptedApiCredentialResponseService } from '../../common/services/api-credentials/build-decrypted-api-credential-response/build-decrypted-api-credential-response.service';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';
import { GetApiCredentialsByUniqueIdDtoIn } from './dtos/get-api-credentials-by-unique-id.dto-in';
import { GetApiCredentialsByUniqueIdDtoOut } from './dtos/get-api-credentials-by-unique-id.dto-out';

@Injectable()
export class GetApiCredentialsByUniqueIdUseCase {
  constructor(
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
    private readonly buildDecryptedApiCredentialResponseService: BuildDecryptedApiCredentialResponseService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: GetApiCredentialsByUniqueIdDtoIn,
  ): Promise<GetApiCredentialsByUniqueIdDtoOut> {
    try {
      const dtoOut = await this.findApiCredentialByUniqueIdService.exec(
        new FindApiCredentialByUniqueIdDtoIn(dtoIn.apiCredentialId),
      );

      const apiCredential =
        this.buildDecryptedApiCredentialResponseService.exec(
          dtoOut.apiCredential,
        );

      return new GetApiCredentialsByUniqueIdDtoOut(apiCredential);
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'GetApiCredentialsByUniqueIdUseCase',
          error,
          appFile: __filename,
          context: {
            apiCredentialId: dtoIn.apiCredentialId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on get api credentials by unique id use case';

      throw new Error(message);
    }
  }
}
