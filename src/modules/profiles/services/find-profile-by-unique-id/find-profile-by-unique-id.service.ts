import { Inject, Injectable } from '@nestjs/common';
import type { IProfilesRepository } from '../../entities/profiles-repository.interface';
import { PROFILES_REPOSITORY } from '../../tokens/profiles.tokens';
import { FindProfileByUniqueIdDtoIn } from './dtos/find-profile-by-unique-id.dto-in';
import { FindProfileByUniqueIdDtoOut } from './dtos/find-profile-by-unique-id.dto-out';

@Injectable()
export class FindProfileByUniqueIdService {
  constructor(
    @Inject(PROFILES_REPOSITORY)
    private readonly repository: IProfilesRepository,
  ) {}

  async exec(
    dtoIn: FindProfileByUniqueIdDtoIn,
  ): Promise<FindProfileByUniqueIdDtoOut> {
    try {
      const profile = await this.repository.findByUniqueId(dtoIn._id);

      if (!profile) {
        throw new Error('profile not found');
      }

      return new FindProfileByUniqueIdDtoOut(profile);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on find profile';

      throw new Error(message);
    }
  }
}