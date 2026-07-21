import { Inject, Injectable } from '@nestjs/common';

import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { PERMISSIONS_REPOSITORY } from '../../tokens/permissions.tokens';
import { ListPermissionsByOfficeIdDtoIn } from './dtos/list-permissions-by-office-id.dto-in';
import { ListPermissionsByOfficeIdDtoOut } from './dtos/list-permissions-by-office-id.dto-out';

@Injectable()
export class ListPermissionsByOfficeIdService {
  constructor(
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly permissionsRepository: IPermissionsRepository,
  ) {}

  async exec(
    dtoIn: ListPermissionsByOfficeIdDtoIn,
  ): Promise<ListPermissionsByOfficeIdDtoOut> {
    try {
      const permissions = await this.permissionsRepository.getAllByOfficeId(
        dtoIn.officeId,
      );

      return new ListPermissionsByOfficeIdDtoOut(permissions);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on list permissions by office id';

      throw new Error(message);
    }
  }
}
