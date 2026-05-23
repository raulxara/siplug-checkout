import { Inject, Injectable } from '@nestjs/common';
import type { IPositionPermissionsRepository } from '../../entities/position-permissions-repository.interface';
import { POSITION_PERMISSIONS_REPOSITORY } from '../../tokens/position-permissions.tokens';
import { GetAllPositionPermissionsByPositionIdDtoIn } from './dtos/get-all-position-permissions-by-position-id.dto-in';
import { GetAllPositionPermissionsByPositionIdDtoOut } from './dtos/get-all-position-permissions-by-position-id.dto-out';

@Injectable()
export class GetAllPositionPermissionsByPositionIdService {
  constructor(
    @Inject(POSITION_PERMISSIONS_REPOSITORY)
    private readonly repository: IPositionPermissionsRepository,
  ) {}

  async exec(
    dtoIn: GetAllPositionPermissionsByPositionIdDtoIn,
  ): Promise<GetAllPositionPermissionsByPositionIdDtoOut> {
    try {
      const rows = await this.repository.getAllByPositionId(dtoIn.positionId);

      return new GetAllPositionPermissionsByPositionIdDtoOut(
        rows,
        rows.length,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all position permissions by position id';

      throw new Error(message);
    }
  }
}