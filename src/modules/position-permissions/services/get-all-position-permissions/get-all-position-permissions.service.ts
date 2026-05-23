import { Inject, Injectable } from '@nestjs/common';
import type { IPositionPermissionsRepository } from '../../entities/position-permissions-repository.interface';
import { POSITION_PERMISSIONS_REPOSITORY } from '../../tokens/position-permissions.tokens';
import { GetAllPositionPermissionsDtoIn } from './dtos/get-all-position-permissions.dto-in';
import { GetAllPositionPermissionsDtoOut } from './dtos/get-all-position-permissions.dto-out';

@Injectable()
export class GetAllPositionPermissionsService {
  constructor(
    @Inject(POSITION_PERMISSIONS_REPOSITORY)
    private readonly repository: IPositionPermissionsRepository,
  ) {}

  async exec(
    dtoIn: GetAllPositionPermissionsDtoIn,
  ): Promise<GetAllPositionPermissionsDtoOut> {
    dtoIn;

    try {
      const rows = await this.repository.getAll();

      return new GetAllPositionPermissionsDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all position permissions';

      throw new Error(message);
    }
  }
}