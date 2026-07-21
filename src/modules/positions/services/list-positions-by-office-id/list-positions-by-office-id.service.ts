import { Inject, Injectable } from '@nestjs/common';

import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { POSITIONS_REPOSITORY } from '../../tokens/positions.tokens';
import { ListPositionsByOfficeIdDtoIn } from './dtos/list-positions-by-office-id.dto-in';
import { ListPositionsByOfficeIdDtoOut } from './dtos/list-positions-by-office-id.dto-out';

@Injectable()
export class ListPositionsByOfficeIdService {
  constructor(
    @Inject(POSITIONS_REPOSITORY)
    private readonly positionsRepository: IPositionsRepository,
  ) {}

  async exec(
    dtoIn: ListPositionsByOfficeIdDtoIn,
  ): Promise<ListPositionsByOfficeIdDtoOut> {
    try {
      const positions = await this.positionsRepository.getAllByOfficeId(
        dtoIn.officeId,
      );

      return new ListPositionsByOfficeIdDtoOut(positions);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on list positions by office id';

      throw new Error(message);
    }
  }
}
