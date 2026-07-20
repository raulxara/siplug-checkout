import { Inject, Injectable } from '@nestjs/common';

import type { IApiCredentialsRepository } from '../../entities/api-credentials-repository.interface';
import { API_CREDENTIALS_REPOSITORY } from '../../tokens/api-credentials.tokens';
import { ListApiCredentialsByOfficeIdDtoIn } from './dtos/list-api-credentials-by-office-id.dto-in';
import { ListApiCredentialsByOfficeIdDtoOut } from './dtos/list-api-credentials-by-office-id.dto-out';

@Injectable()
export class ListApiCredentialsByOfficeIdService {
  constructor(
    @Inject(API_CREDENTIALS_REPOSITORY)
    private readonly repository: IApiCredentialsRepository,
  ) {}

  async exec(
    dtoIn: ListApiCredentialsByOfficeIdDtoIn,
  ): Promise<ListApiCredentialsByOfficeIdDtoOut> {
    try {
      const apiCredentials = await this.repository.getAllByOfficeId(
        dtoIn.officeId,
      );

      return new ListApiCredentialsByOfficeIdDtoOut(apiCredentials);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on list api credentials by office id';

      throw new Error(message);
    }
  }
}
