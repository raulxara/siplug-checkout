import { Inject, Injectable } from '@nestjs/common';
import { PermissionEntity } from '../../entities/permission.entity';
import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { PERMISSIONS_REPOSITORY } from '../../tokens/permissions.tokens';
import { CreatePermissionDtoIn } from './dtos/create-permission.dto-in';
import { CreatePermissionDtoOut } from './dtos/create-permission.dto-out';

@Injectable()
export class CreatePermissionService {
  constructor(
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly repository: IPermissionsRepository,
  ) {}

  async exec(dtoIn: CreatePermissionDtoIn): Promise<CreatePermissionDtoOut> {
    try {
      const entity = new PermissionEntity(this.repository);

      entity.officeId = dtoIn.officeId;
      entity.name = dtoIn.name;
      entity.slug = dtoIn.slug;
      entity.description = dtoIn.description;
      entity.entity = dtoIn.entity;
      entity.action = dtoIn.action;
      entity.config = dtoIn.config;
      entity.status = dtoIn.status;

      await entity.create();

      return CreatePermissionDtoOut.fromEntity(entity);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on create permission';

      throw new Error(message);
    }
  }
}