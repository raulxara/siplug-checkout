import { Inject, Injectable } from '@nestjs/common';
import type { IProfilesRepository } from '../../entities/profiles-repository.interface';
import { PROFILES_REPOSITORY } from '../../tokens/profiles.tokens';
import { ValidateProfileEmailUniquenessDtoIn } from './dtos/validate-profile-email-uniqueness.dto-in';

@Injectable()
export class ValidateProfileEmailUniquenessService {
  constructor(
    @Inject(PROFILES_REPOSITORY)
    private readonly repository: IProfilesRepository,
  ) {}

  async exec(dtoIn: ValidateProfileEmailUniquenessDtoIn): Promise<void> {
    try {
      const profile = await this.repository.findByEmail(dtoIn.email);

      if (profile) {
        throw new Error('profile email already exists');
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on validate profile email uniqueness';

      throw new Error(message);
    }
  }
}