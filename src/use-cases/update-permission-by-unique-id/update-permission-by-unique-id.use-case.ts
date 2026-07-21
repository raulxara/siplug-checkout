import { Injectable } from '@nestjs/common';

import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindPermissionByUniqueIdDtoIn } from '../../modules/permissions/services/find-permission-by-unique-id/dtos/find-permission-by-unique-id.dto-in';
import { FindPermissionByUniqueIdService } from '../../modules/permissions/services/find-permission-by-unique-id/find-permission-by-unique-id.service';
import { UpdatePermissionDtoIn } from '../../modules/permissions/services/update-permission/dtos/update-permission.dto-in';
import { UpdatePermissionService } from '../../modules/permissions/services/update-permission/update-permission.service';
import { UpdatePermissionByUniqueIdDtoIn } from './dtos/update-permission-by-unique-id.dto-in';
import { UpdatePermissionByUniqueIdDtoOut } from './dtos/update-permission-by-unique-id.dto-out';

@Injectable()
export class UpdatePermissionByUniqueIdUseCase {
  constructor(
    private readonly findPermissionByUniqueIdService: FindPermissionByUniqueIdService,
    private readonly updatePermissionService: UpdatePermissionService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: UpdatePermissionByUniqueIdDtoIn,
  ): Promise<UpdatePermissionByUniqueIdDtoOut> {
    try {
      const currentPermissionDtoOut =
        await this.findPermissionByUniqueIdService.exec(
          new FindPermissionByUniqueIdDtoIn(dtoIn.permissionId),
        );

      const currentPermission = currentPermissionDtoOut.permission;

      if (
        dtoIn.officeId !== undefined &&
        currentPermission.officeId !== null &&
        currentPermission.officeId !== dtoIn.officeId
      ) {
        throw new Error('permission does not belong to informed officeId');
      }

      const updatedPermissionDtoOut = await this.updatePermissionService.exec(
        new UpdatePermissionDtoIn({
          _id: dtoIn.permissionId,
          officeId: dtoIn.officeId,
          name: dtoIn.name,
          slug: dtoIn.slug,
          description: dtoIn.description,
          entity: dtoIn.entity,
          action: dtoIn.action,
          config: dtoIn.config,
          status: dtoIn.status,
          source: 'UpdatePermissionByUniqueIdController',
        }),
      );

      return new UpdatePermissionByUniqueIdDtoOut({
        ...updatedPermissionDtoOut.permission,
      });
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'UpdatePermissionByUniqueIdUseCase',
          error,
          appFile: __filename,
          context: {
            permissionId: dtoIn.permissionId,
            officeId: dtoIn.officeId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on update permission by unique id use case';

      throw new Error(message);
    }
  }
}