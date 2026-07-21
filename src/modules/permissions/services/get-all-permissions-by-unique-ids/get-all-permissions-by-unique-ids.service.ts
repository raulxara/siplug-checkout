import { Inject, Injectable } from '@nestjs/common';
import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { PERMISSIONS_REPOSITORY } from '../../tokens/permissions.tokens';
import { GetAllPermissionsByUniqueIdsDtoIn } from './dtos/get-all-permissions-by-unique-ids.dto-in';
import { GetAllPermissionsByUniqueIdsDtoOut } from './dtos/get-all-permissions-by-unique-ids.dto-out';

@Injectable()
export class GetAllPermissionsByUniqueIdsService {
  constructor(
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly repository: IPermissionsRepository,
  ) {}

  async exec(
    dtoIn: GetAllPermissionsByUniqueIdsDtoIn,
  ): Promise<GetAllPermissionsByUniqueIdsDtoOut> {
    try {
      const rows = await this.repository.getAllByUniqueIds(dtoIn._ids);

      return new GetAllPermissionsByUniqueIdsDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all permissions by unique ids';

      throw new Error(message);
    }
  }
}