import { Inject, Injectable } from '@nestjs/common';
import type { IApiCredentialsRepository } from '../../entities/api-credentials-repository.interface';
import { API_CREDENTIALS_REPOSITORY } from '../../tokens/api-credentials.tokens';
import { ValidateApiCredentialSlugUniquenessDtoIn } from './dtos/validate-api-credential-slug-uniqueness.dto-in';

@Injectable()
export class ValidateApiCredentialSlugUniquenessService {
  constructor(
    @Inject(API_CREDENTIALS_REPOSITORY)
    private readonly repository: IApiCredentialsRepository,
  ) {}

  async exec(
    dtoIn: ValidateApiCredentialSlugUniquenessDtoIn,
  ): Promise<void> {
    try {
      const apiCredential = await this.repository.findByOfficeIdAndSlug(
        dtoIn.officeId,
        dtoIn.slug,
      );

      if (apiCredential) {
        throw new Error('api credential slug already exists');
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on validate api credential slug uniqueness';

      throw new Error(message);
    }
  }
}