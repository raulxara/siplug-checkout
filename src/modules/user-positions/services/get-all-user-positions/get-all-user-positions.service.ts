import { Inject, Injectable } from '@nestjs/common';
import type { IUserPositionsRepository } from '../../entities/user-positions-repository.interface';
import { USER_POSITIONS_REPOSITORY } from '../../tokens/user-positions.tokens';
import { GetAllUserPositionsDtoIn } from './dtos/get-all-user-positions.dto-in';
import { GetAllUserPositionsDtoOut } from './dtos/get-all-user-positions.dto-out';

@Injectable()
export class GetAllUserPositionsService {
  constructor(
    @Inject(USER_POSITIONS_REPOSITORY)
    private readonly repository: IUserPositionsRepository,
  ) {}

  async exec(
    dtoIn: GetAllUserPositionsDtoIn,
  ): Promise<GetAllUserPositionsDtoOut> {
    dtoIn;

    try {
      const rows = await this.repository.getAll();

      return new GetAllUserPositionsDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all user positions';

      throw new Error(message);
    }
  }
}