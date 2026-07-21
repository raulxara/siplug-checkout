import { Inject, Injectable } from '@nestjs/common';
import type { IUserPositionsRepository } from '../../entities/user-positions-repository.interface';
import { USER_POSITIONS_REPOSITORY } from '../../tokens/user-positions.tokens';
import { GetAllUserPositionsByUserCustomerIdsDtoIn } from './dtos/get-all-user-positions-by-user-customer-ids.dto-in';
import { GetAllUserPositionsByUserCustomerIdsDtoOut } from './dtos/get-all-user-positions-by-user-customer-ids.dto-out';

@Injectable()
export class GetAllUserPositionsByUserCustomerIdsService {
  constructor(
    @Inject(USER_POSITIONS_REPOSITORY)
    private readonly repository: IUserPositionsRepository,
  ) {}

  async exec(
    dtoIn: GetAllUserPositionsByUserCustomerIdsDtoIn,
  ): Promise<GetAllUserPositionsByUserCustomerIdsDtoOut> {
    try {
      const rows = await this.repository.getAllByUserCustomerIds(
        dtoIn.userCustomerIds,
      );

      return new GetAllUserPositionsByUserCustomerIdsDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all user positions by user customer ids';

      throw new Error(message);
    }
  }
}