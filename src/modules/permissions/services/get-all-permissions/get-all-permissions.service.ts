import { Inject, Injectable } from '@nestjs/common';
import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { PERMISSIONS_REPOSITORY } from '../../tokens/permissions.tokens';
import { GetAllPermissionsDtoIn } from './dtos/get-all-permissions.dto-in';
import { GetAllPermissionsDtoOut } from './dtos/get-all-permissions.dto-out';

@Injectable()
export class GetAllPermissionsService {
  constructor(
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly repository: IPermissionsRepository,
  ) {}

  async exec(dtoIn: GetAllPermissionsDtoIn): Promise<GetAllPermissionsDtoOut> {
    dtoIn;

    try {
      const rows = await this.repository.getAll();

      return new GetAllPermissionsDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on get all permissions';

      throw new Error(message);
    }
  }
}