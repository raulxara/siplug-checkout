import { Injectable } from '@nestjs/common';

import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindPermissionByUniqueIdDtoIn } from '../../modules/permissions/services/find-permission-by-unique-id/dtos/find-permission-by-unique-id.dto-in';
import { FindPermissionByUniqueIdService } from '../../modules/permissions/services/find-permission-by-unique-id/find-permission-by-unique-id.service';
import { GetPermissionByUniqueIdDtoIn } from './dtos/get-permission-by-unique-id.dto-in';
import { GetPermissionByUniqueIdDtoOut } from './dtos/get-permission-by-unique-id.dto-out';

@Injectable()
export class GetPermissionByUniqueIdUseCase {
  constructor(
    private readonly findPermissionByUniqueIdService: FindPermissionByUniqueIdService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: GetPermissionByUniqueIdDtoIn,
  ): Promise<GetPermissionByUniqueIdDtoOut> {
    try {
      const dtoOut = await this.findPermissionByUniqueIdService.exec(
        new FindPermissionByUniqueIdDtoIn(dtoIn.permissionId),
      );

      return new GetPermissionByUniqueIdDtoOut({
        ...dtoOut.permission,
      });
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'GetPermissionByUniqueIdUseCase',
          error,
          appFile: __filename,
          context: {
            permissionId: dtoIn.permissionId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on get permission by unique id use case';

      throw new Error(message);
    }
  }
}
