import { Inject, Injectable } from '@nestjs/common';
import type { IUserPositionsRepository } from '../../entities/user-positions-repository.interface';
import { USER_POSITIONS_REPOSITORY } from '../../tokens/user-positions.tokens';
import { FindUserPositionByUserCustomerAndPositionDtoIn } from './dtos/find-user-position-by-user-customer-and-position.dto-in';
import { FindUserPositionByUserCustomerAndPositionDtoOut } from './dtos/find-user-position-by-user-customer-and-position.dto-out';

@Injectable()
export class FindUserPositionByUserCustomerAndPositionService {
  constructor(
    @Inject(USER_POSITIONS_REPOSITORY)
    private readonly repository: IUserPositionsRepository,
  ) {}

  async exec(
    dtoIn: FindUserPositionByUserCustomerAndPositionDtoIn,
  ): Promise<FindUserPositionByUserCustomerAndPositionDtoOut> {
    try {
      const userPosition = await this.repository.findByUserCustomerAndPosition(
        dtoIn.userCustomerId,
        dtoIn.positionId,
      );

      if (!userPosition) {
        throw new Error('user position not found');
      }

      return new FindUserPositionByUserCustomerAndPositionDtoOut(userPosition);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find user position by user customer and position';

      throw new Error(message);
    }
  }
}