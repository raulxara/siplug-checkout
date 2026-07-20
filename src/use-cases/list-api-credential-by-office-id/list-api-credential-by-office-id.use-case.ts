import { Injectable } from '@nestjs/common';

import { BuildDecryptedApiCredentialResponseService } from '../../common/services/api-credentials/build-decrypted-api-credential-response/build-decrypted-api-credential-response.service';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { ListApiCredentialsByOfficeIdDtoIn } from '../../modules/api-credentials/services/list-api-credentials-by-office-id/dtos/list-api-credentials-by-office-id.dto-in';
import { ListApiCredentialsByOfficeIdService } from '../../modules/api-credentials/services/list-api-credentials-by-office-id/list-api-credentials-by-office-id.service';
import { ListApiCredentialByOfficeIdDtoIn } from './dtos/list-api-credential-by-office-id.dto-in';
import { ListApiCredentialByOfficeIdDtoOut } from './dtos/list-api-credential-by-office-id.dto-out';

@Injectable()
export class ListApiCredentialByOfficeIdUseCase {
  constructor(
    private readonly listApiCredentialsByOfficeIdService: ListApiCredentialsByOfficeIdService,
    private readonly buildDecryptedApiCredentialResponseService: BuildDecryptedApiCredentialResponseService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ListApiCredentialByOfficeIdDtoIn,
  ): Promise<ListApiCredentialByOfficeIdDtoOut> {
    try {
      const dtoOut = await this.listApiCredentialsByOfficeIdService.exec(
        new ListApiCredentialsByOfficeIdDtoIn({
          officeId: dtoIn.officeId,
        }),
      );

      const apiCredentials = dtoOut.apiCredentials.map((apiCredential) =>
        this.buildDecryptedApiCredentialResponseService.exec(apiCredential),
      );

      return new ListApiCredentialByOfficeIdDtoOut(
        apiCredentials,
        apiCredentials.length,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ListApiCredentialByOfficeIdUseCase',
          error,
          appFile: __filename,
          context: {
            officeId: dtoIn.officeId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on list api credential by office id use case';

      throw new Error(message);
    }
  }
}
