import { Inject, Injectable } from '@nestjs/common';
import type { IPositionPermissionsRepository } from '../../entities/position-permissions-repository.interface';
import { POSITION_PERMISSIONS_REPOSITORY } from '../../tokens/position-permissions.tokens';
import { GetAllPositionPermissionsByPositionIdsDtoIn } from './dtos/get-all-position-permissions-by-position-ids.dto-in';
import { GetAllPositionPermissionsByPositionIdsDtoOut } from './dtos/get-all-position-permissions-by-position-ids.dto-out';

@Injectable()
export class GetAllPositionPermissionsByPositionIdsService {
  constructor(
    @Inject(POSITION_PERMISSIONS_REPOSITORY)
    private readonly repository: IPositionPermissionsRepository,
  ) {}

  async exec(
    dtoIn: GetAllPositionPermissionsByPositionIdsDtoIn,
  ): Promise<GetAllPositionPermissionsByPositionIdsDtoOut> {
    try {
      const rows = await this.repository.getAllByPositionIds(
        dtoIn.positionIds,
      );

      return new GetAllPositionPermissionsByPositionIdsDtoOut(
        rows,
        rows.length,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all position permissions by position ids';

      throw new Error(message);
    }
  }
}