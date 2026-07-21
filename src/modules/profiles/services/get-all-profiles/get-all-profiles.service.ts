import { Inject, Injectable } from '@nestjs/common';
import type { IProfilesRepository } from '../../entities/profiles-repository.interface';
import { PROFILES_REPOSITORY } from '../../tokens/profiles.tokens';
import { GetAllProfilesDtoIn } from './dtos/get-all-profiles.dto-in';
import { GetAllProfilesDtoOut } from './dtos/get-all-profiles.dto-out';

@Injectable()
export class GetAllProfilesService {
  constructor(
    @Inject(PROFILES_REPOSITORY)
    private readonly repository: IProfilesRepository,
  ) {}

  async exec(dtoIn: GetAllProfilesDtoIn): Promise<GetAllProfilesDtoOut> {
    dtoIn;

    try {
      const rows = await this.repository.getAll();

      return new GetAllProfilesDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on get all profiles';

      throw new Error(message);
    }
  }
}