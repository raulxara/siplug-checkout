import { Inject, Injectable } from '@nestjs/common';
import type { IUserPositionsRepository } from '../../entities/user-positions-repository.interface';
import { USER_POSITIONS_REPOSITORY } from '../../tokens/user-positions.tokens';
import { FindUserPositionByUniqueIdDtoIn } from './dtos/find-user-position-by-unique-id.dto-in';
import { FindUserPositionByUniqueIdDtoOut } from './dtos/find-user-position-by-unique-id.dto-out';

@Injectable()
export class FindUserPositionByUniqueIdService {
  constructor(
    @Inject(USER_POSITIONS_REPOSITORY)
    private readonly repository: IUserPositionsRepository,
  ) {}

  async exec(
    dtoIn: FindUserPositionByUniqueIdDtoIn,
  ): Promise<FindUserPositionByUniqueIdDtoOut> {
    try {
      const userPosition = await this.repository.findByUniqueId(dtoIn._id);

      if (!userPosition) {
        throw new Error('user position not found');
      }

      return new FindUserPositionByUniqueIdDtoOut(userPosition);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find user position';

      throw new Error(message);
    }
  }
}