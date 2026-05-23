import { Inject, Injectable } from '@nestjs/common';
import type { IProfilesRepository } from '../../entities/profiles-repository.interface';
import { PROFILES_REPOSITORY } from '../../tokens/profiles.tokens';
import { FindProfileByEmailDtoIn } from './dtos/find-profile-by-email.dto-in';
import { FindProfileByEmailDtoOut } from './dtos/find-profile-by-email.dto-out';

@Injectable()
export class FindProfileByEmailService {
  constructor(
    @Inject(PROFILES_REPOSITORY)
    private readonly repository: IProfilesRepository,
  ) {}

  async exec(
    dtoIn: FindProfileByEmailDtoIn,
  ): Promise<FindProfileByEmailDtoOut> {
    try {
      const profile = await this.repository.findByEmail(dtoIn.email);

      if (!profile) {
        throw new Error('profile not found');
      }

      return new FindProfileByEmailDtoOut(profile);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on find profile email';

      throw new Error(message);
    }
  }
}