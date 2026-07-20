import { Inject, Injectable } from '@nestjs/common';

import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { POSITIONS_REPOSITORY } from '../../tokens/positions.tokens';
import { UpdatePositionByUniqueIdDtoIn } from './dtos/update-position-by-unique-id.dto-in';
import { UpdatePositionByUniqueIdDtoOut } from './dtos/update-position-by-unique-id.dto-out';

@Injectable()
export class UpdatePositionByUniqueIdService {
  constructor(
    @Inject(POSITIONS_REPOSITORY)
    private readonly positionsRepository: IPositionsRepository,
  ) {}

  async exec(
    dtoIn: UpdatePositionByUniqueIdDtoIn,
  ): Promise<UpdatePositionByUniqueIdDtoOut> {
    try {
      const position = await this.positionsRepository.updateByUniqueId(
        dtoIn.positionId,
        dtoIn.data,
      );

      return new UpdatePositionByUniqueIdDtoOut(position);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update position by unique id';

      throw new Error(message);
    }
  }
}
