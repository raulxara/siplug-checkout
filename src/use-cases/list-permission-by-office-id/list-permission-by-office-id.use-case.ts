import { Injectable } from '@nestjs/common';

import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { ListPermissionsByOfficeIdDtoIn } from '../../modules/permissions/services/list-permissions-by-office-id/dtos/list-permissions-by-office-id.dto-in';
import { ListPermissionsByOfficeIdService } from '../../modules/permissions/services/list-permissions-by-office-id/list-permissions-by-office-id.service';
import { ListPermissionByOfficeIdDtoIn } from './dtos/list-permission-by-office-id.dto-in';
import { ListPermissionByOfficeIdDtoOut } from './dtos/list-permission-by-office-id.dto-out';

@Injectable()
export class ListPermissionByOfficeIdUseCase {
  constructor(
    private readonly listPermissionsByOfficeIdService: ListPermissionsByOfficeIdService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ListPermissionByOfficeIdDtoIn,
  ): Promise<ListPermissionByOfficeIdDtoOut> {
    try {
      const dtoOut = await this.listPermissionsByOfficeIdService.exec(
        new ListPermissionsByOfficeIdDtoIn({
          officeId: dtoIn.officeId,
        }),
      );

      return new ListPermissionByOfficeIdDtoOut(
        dtoOut.permissions.map((permission) => ({
          ...permission,
        })),
        dtoOut.permissions.length,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ListPermissionByOfficeIdUseCase',
          error,
          appFile: __filename,
          context: {
            officeId: dtoIn.officeId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on list permission by office id use case';

      throw new Error(message);
    }
  }
}
