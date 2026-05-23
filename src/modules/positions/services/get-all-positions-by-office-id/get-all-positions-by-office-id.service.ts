import { Inject, Injectable } from '@nestjs/common';
import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { POSITIONS_REPOSITORY } from '../../tokens/positions.tokens';
import { GetAllPositionsByOfficeIdDtoIn } from './dtos/get-all-positions-by-office-id.dto-in';
import { GetAllPositionsByOfficeIdDtoOut } from './dtos/get-all-positions-by-office-id.dto-out';

@Injectable()
export class GetAllPositionsByOfficeIdService {
  constructor(
    @Inject(POSITIONS_REPOSITORY)
    private readonly repository: IPositionsRepository,
  ) {}

  async exec(
    dtoIn: GetAllPositionsByOfficeIdDtoIn,
  ): Promise<GetAllPositionsByOfficeIdDtoOut> {
    try {
      const rows = await this.repository.getAllByOfficeId(dtoIn.officeId);

      return new GetAllPositionsByOfficeIdDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all positions by office id';

      throw new Error(message);
    }
  }
}