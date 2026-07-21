import { Inject, Injectable } from '@nestjs/common';
import { PositionPermissionEntity } from '../../entities/position-permission.entity';
import type { IPositionPermissionsRepository } from '../../entities/position-permissions-repository.interface';
import { POSITION_PERMISSIONS_REPOSITORY } from '../../tokens/position-permissions.tokens';
import { CreatePositionPermissionDtoIn } from './dtos/create-position-permission.dto-in';
import { CreatePositionPermissionDtoOut } from './dtos/create-position-permission.dto-out';

@Injectable()
export class CreatePositionPermissionService {
  constructor(
    @Inject(POSITION_PERMISSIONS_REPOSITORY)
    private readonly repository: IPositionPermissionsRepository,
  ) {}

  async exec(
    dtoIn: CreatePositionPermissionDtoIn,
  ): Promise<CreatePositionPermissionDtoOut> {
    try {
      const entity = new PositionPermissionEntity(this.repository);

      entity.positionId = dtoIn.positionId;
      entity.permissionId = dtoIn.permissionId;
      entity.config = dtoIn.config;
      entity.status = dtoIn.status;

      await entity.create();

      return CreatePositionPermissionDtoOut.fromEntity(entity);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on create position permission';

      throw new Error(message);
    }
  }
}