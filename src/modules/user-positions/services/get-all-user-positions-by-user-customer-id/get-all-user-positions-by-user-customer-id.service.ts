import { Inject, Injectable } from '@nestjs/common';
import type { IUserPositionsRepository } from '../../entities/user-positions-repository.interface';
import { USER_POSITIONS_REPOSITORY } from '../../tokens/user-positions.tokens';
import { GetAllUserPositionsByUserCustomerIdDtoIn } from './dtos/get-all-user-positions-by-user-customer-id.dto-in';
import { GetAllUserPositionsByUserCustomerIdDtoOut } from './dtos/get-all-user-positions-by-user-customer-id.dto-out';

@Injectable()
export class GetAllUserPositionsByUserCustomerIdService {
  constructor(
    @Inject(USER_POSITIONS_REPOSITORY)
    private readonly repository: IUserPositionsRepository,
  ) {}

  async exec(
    dtoIn: GetAllUserPositionsByUserCustomerIdDtoIn,
  ): Promise<GetAllUserPositionsByUserCustomerIdDtoOut> {
    try {
      const rows = await this.repository.getAllByUserCustomerId(
        dtoIn.userCustomerId,
      );

      return new GetAllUserPositionsByUserCustomerIdDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all user positions by user customer id';

      throw new Error(message);
    }
  }
}