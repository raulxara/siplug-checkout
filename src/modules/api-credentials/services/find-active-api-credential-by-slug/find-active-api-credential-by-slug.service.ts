import { Inject, Injectable } from '@nestjs/common';
import type { IApiCredentialsRepository } from '../../entities/api-credentials-repository.interface';
import { API_CREDENTIALS_REPOSITORY } from '../../tokens/api-credentials.tokens';
import { FindActiveApiCredentialBySlugDtoIn } from './dtos/find-active-api-credential-by-slug.dto-in';
import { FindActiveApiCredentialBySlugDtoOut } from './dtos/find-active-api-credential-by-slug.dto-out';

@Injectable()
export class FindActiveApiCredentialBySlugService {
  constructor(
    @Inject(API_CREDENTIALS_REPOSITORY)
    private readonly repository: IApiCredentialsRepository,
  ) {}

  async exec(
    dtoIn: FindActiveApiCredentialBySlugDtoIn,
  ): Promise<FindActiveApiCredentialBySlugDtoOut> {
    try {
      const rows = await this.repository.getAll();

      const row = rows.find(
        (item) => item.slug === dtoIn.slug && item.status === 'active',
      );

      if (!row) {
        throw new Error(`active api credential not found for slug ${dtoIn.slug}`);
      }

      return new FindActiveApiCredentialBySlugDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find active api credential by slug';

      throw new Error(message);
    }
  }
}