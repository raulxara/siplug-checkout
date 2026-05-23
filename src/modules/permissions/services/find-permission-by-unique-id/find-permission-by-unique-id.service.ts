import { Inject, Injectable } from '@nestjs/common';
import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { PERMISSIONS_REPOSITORY } from '../../tokens/permissions.tokens';
import { FindPermissionByUniqueIdDtoIn } from './dtos/find-permission-by-unique-id.dto-in';
import { FindPermissionByUniqueIdDtoOut } from './dtos/find-permission-by-unique-id.dto-out';

@Injectable()
export class FindPermissionByUniqueIdService {
  constructor(
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly repository: IPermissionsRepository,
  ) {}

  async exec(
    dtoIn: FindPermissionByUniqueIdDtoIn,
  ): Promise<FindPermissionByUniqueIdDtoOut> {
    try {
      const permission = await this.repository.findByUniqueId(dtoIn._id);

      if (!permission) {
        throw new Error('permission not found');
      }

      return new FindPermissionByUniqueIdDtoOut(permission);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on find permission';

      throw new Error(message);
    }
  }
}