import { Inject, Injectable } from '@nestjs/common';
import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { PERMISSIONS_REPOSITORY } from '../../tokens/permissions.tokens';
import { GetAllPermissionsByOfficeIdDtoIn } from './dtos/get-all-permissions-by-office-id.dto-in';
import { GetAllPermissionsByOfficeIdDtoOut } from './dtos/get-all-permissions-by-office-id.dto-out';

@Injectable()
export class GetAllPermissionsByOfficeIdService {
  constructor(
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly repository: IPermissionsRepository,
  ) {}

  async exec(
    dtoIn: GetAllPermissionsByOfficeIdDtoIn,
  ): Promise<GetAllPermissionsByOfficeIdDtoOut> {
    try {
      const rows = await this.repository.getAllByOfficeId(dtoIn.officeId);

      return new GetAllPermissionsByOfficeIdDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all permissions by office id';

      throw new Error(message);
    }
  }
}