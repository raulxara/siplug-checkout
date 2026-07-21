import { Inject, Injectable } from '@nestjs/common';
import type { IPositionPermissionsRepository } from '../../entities/position-permissions-repository.interface';
import { POSITION_PERMISSIONS_REPOSITORY } from '../../tokens/position-permissions.tokens';
import { FindPositionPermissionByPositionAndPermissionDtoIn } from './dtos/find-position-permission-by-position-and-permission.dto-in';
import { FindPositionPermissionByPositionAndPermissionDtoOut } from './dtos/find-position-permission-by-position-and-permission.dto-out';

@Injectable()
export class FindPositionPermissionByPositionAndPermissionService {
  constructor(
    @Inject(POSITION_PERMISSIONS_REPOSITORY)
    private readonly repository: IPositionPermissionsRepository,
  ) {}

  async exec(
    dtoIn: FindPositionPermissionByPositionAndPermissionDtoIn,
  ): Promise<FindPositionPermissionByPositionAndPermissionDtoOut> {
    try {
      const positionPermission =
        await this.repository.findByPositionAndPermission(
          dtoIn.positionId,
          dtoIn.permissionId,
        );

      if (!positionPermission) {
        throw new Error('position permission not found');
      }

      return new FindPositionPermissionByPositionAndPermissionDtoOut(
        positionPermission,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find position permission by position and permission';

      throw new Error(message);
    }
  }
}