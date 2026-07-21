import { Inject, Injectable } from '@nestjs/common';
import type { IProfilesRepository } from '../../entities/profiles-repository.interface';
import { PROFILES_REPOSITORY } from '../../tokens/profiles.tokens';
import { FindProfileByDocumentDtoIn } from './dtos/find-profile-by-document.dto-in';
import { FindProfileByDocumentDtoOut } from './dtos/find-profile-by-document.dto-out';

@Injectable()
export class FindProfileByDocumentService {
  constructor(
    @Inject(PROFILES_REPOSITORY)
    private readonly repository: IProfilesRepository,
  ) {}

  async exec(
    dtoIn: FindProfileByDocumentDtoIn,
  ): Promise<FindProfileByDocumentDtoOut> {
    try {
      const profile = await this.repository.findByDocument(
        dtoIn.documentType,
        dtoIn.documentValue,
      );

      if (!profile) {
        throw new Error('profile not found');
      }

      return new FindProfileByDocumentDtoOut(profile);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find profile document';

      throw new Error(message);
    }
  }
}