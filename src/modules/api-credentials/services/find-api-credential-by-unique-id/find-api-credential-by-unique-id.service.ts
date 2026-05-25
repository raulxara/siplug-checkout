import { Inject, Injectable } from '@nestjs/common';
import type { IApiCredentialsRepository } from '../../entities/api-credentials-repository.interface';
import { API_CREDENTIALS_REPOSITORY } from '../../tokens/api-credentials.tokens';
import { FindApiCredentialByUniqueIdDtoIn } from './dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdDtoOut } from './dtos/find-api-credential-by-unique-id.dto-out';

@Injectable()
export class FindApiCredentialByUniqueIdService {
  constructor(
    @Inject(API_CREDENTIALS_REPOSITORY)
    private readonly repository: IApiCredentialsRepository,
  ) {}

  async exec(
    dtoIn: FindApiCredentialByUniqueIdDtoIn,
  ): Promise<FindApiCredentialByUniqueIdDtoOut> {
    try {
      const apiCredential = await this.repository.findByUniqueId(dtoIn._id);

      if (!apiCredential) {
        throw new Error('api credential not found');
      }

      return new FindApiCredentialByUniqueIdDtoOut(apiCredential);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find api credential by unique id';

      throw new Error(message);
    }
  }
}