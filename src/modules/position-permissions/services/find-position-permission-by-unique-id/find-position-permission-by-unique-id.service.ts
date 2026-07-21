import { Inject, Injectable } from '@nestjs/common';
import type { IPositionPermissionsRepository } from '../../entities/position-permissions-repository.interface';
import { POSITION_PERMISSIONS_REPOSITORY } from '../../tokens/position-permissions.tokens';
import { FindPositionPermissionByUniqueIdDtoIn } from './dtos/find-position-permission-by-unique-id.dto-in';
import { FindPositionPermissionByUniqueIdDtoOut } from './dtos/find-position-permission-by-unique-id.dto-out';

@Injectable()
export class FindPositionPermissionByUniqueIdService {
  constructor(
    @Inject(POSITION_PERMISSIONS_REPOSITORY)
    private readonly repository: IPositionPermissionsRepository,
  ) {}

  async exec(
    dtoIn: FindPositionPermissionByUniqueIdDtoIn,
  ): Promise<FindPositionPermissionByUniqueIdDtoOut> {
    try {
      const positionPermission = await this.repository.findByUniqueId(
        dtoIn._id,
      );

      if (!positionPermission) {
        throw new Error('position permission not found');
      }

      return new FindPositionPermissionByUniqueIdDtoOut(positionPermission);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find position permission';

      throw new Error(message);
    }
  }
}