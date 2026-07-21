import { Inject, Injectable } from '@nestjs/common';
import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { POSITIONS_REPOSITORY } from '../../tokens/positions.tokens';
import { GetAllPositionsByUniqueIdsDtoIn } from './dtos/get-all-positions-by-unique-ids.dto-in';
import { GetAllPositionsByUniqueIdsDtoOut } from './dtos/get-all-positions-by-unique-ids.dto-out';

@Injectable()
export class GetAllPositionsByUniqueIdsService {
  constructor(
    @Inject(POSITIONS_REPOSITORY)
    private readonly repository: IPositionsRepository,
  ) {}

  async exec(
    dtoIn: GetAllPositionsByUniqueIdsDtoIn,
  ): Promise<GetAllPositionsByUniqueIdsDtoOut> {
    try {
      const rows = await this.repository.getAllByUniqueIds(dtoIn._ids);

      return new GetAllPositionsByUniqueIdsDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all positions by unique ids';

      throw new Error(message);
    }
  }
}