import { Inject, Injectable } from '@nestjs/common';
import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { POSITIONS_REPOSITORY } from '../../tokens/positions.tokens';
import { GetAllPositionsDtoIn } from './dtos/get-all-positions.dto-in';
import { GetAllPositionsDtoOut } from './dtos/get-all-positions.dto-out';

@Injectable()
export class GetAllPositionsService {
  constructor(
    @Inject(POSITIONS_REPOSITORY)
    private readonly repository: IPositionsRepository,
  ) {}

  async exec(dtoIn: GetAllPositionsDtoIn): Promise<GetAllPositionsDtoOut> {
    dtoIn;

    try {
      const rows = await this.repository.getAll();

      return new GetAllPositionsDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on get all positions';

      throw new Error(message);
    }
  }
}