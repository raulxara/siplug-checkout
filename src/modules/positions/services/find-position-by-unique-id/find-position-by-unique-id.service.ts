import { Inject, Injectable } from '@nestjs/common';
import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { POSITIONS_REPOSITORY } from '../../tokens/positions.tokens';
import { FindPositionByUniqueIdDtoIn } from './dtos/find-position-by-unique-id.dto-in';
import { FindPositionByUniqueIdDtoOut } from './dtos/find-position-by-unique-id.dto-out';

@Injectable()
export class FindPositionByUniqueIdService {
  constructor(
    @Inject(POSITIONS_REPOSITORY)
    private readonly repository: IPositionsRepository,
  ) {}

  async exec(
    dtoIn: FindPositionByUniqueIdDtoIn,
  ): Promise<FindPositionByUniqueIdDtoOut> {
    try {
      const position = await this.repository.findByUniqueId(dtoIn._id);

      if (!position) {
        throw new Error('position not found');
      }

      return new FindPositionByUniqueIdDtoOut(position);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on find position';

      throw new Error(message);
    }
  }
}