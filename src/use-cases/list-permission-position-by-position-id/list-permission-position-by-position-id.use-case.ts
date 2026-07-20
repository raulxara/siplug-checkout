import { Injectable } from '@nestjs/common';

import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { GetAllPositionPermissionsByPositionIdsDtoIn } from '../../modules/position-permissions/services/get-all-position-permissions-by-position-ids/dtos/get-all-position-permissions-by-position-ids.dto-in';
import { GetAllPositionPermissionsByPositionIdsService } from '../../modules/position-permissions/services/get-all-position-permissions-by-position-ids/get-all-position-permissions-by-position-ids.service';
import { FindPositionByUniqueIdDtoIn } from '../../modules/positions/services/find-position-by-unique-id/dtos/find-position-by-unique-id.dto-in';
import { FindPositionByUniqueIdService } from '../../modules/positions/services/find-position-by-unique-id/find-position-by-unique-id.service';
import { ListPermissionPositionByPositionIdDtoIn } from './dtos/list-permission-position-by-position-id.dto-in';
import { ListPermissionPositionByPositionIdDtoOut } from './dtos/list-permission-position-by-position-id.dto-out';

@Injectable()
export class ListPermissionPositionByPositionIdUseCase {
  constructor(
    private readonly findPositionByUniqueIdService: FindPositionByUniqueIdService,
    private readonly getAllPositionPermissionsByPositionIdsService: GetAllPositionPermissionsByPositionIdsService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ListPermissionPositionByPositionIdDtoIn,
  ): Promise<ListPermissionPositionByPositionIdDtoOut> {
    try {
      const positionDtoOut = await this.findPositionByUniqueIdService.exec(
        new FindPositionByUniqueIdDtoIn(dtoIn.positionId),
      );

      const position = positionDtoOut.position;

      if (
        dtoIn.officeId !== undefined &&
        position.officeId !== null &&
        position.officeId !== dtoIn.officeId
      ) {
        throw new Error('position does not belong to informed officeId');
      }

      const positionPermissionsDtoOut =
        await this.getAllPositionPermissionsByPositionIdsService.exec(
          new GetAllPositionPermissionsByPositionIdsDtoIn([dtoIn.positionId]),
        );

      const positionPermissions = positionPermissionsDtoOut.items.map(
        (positionPermission) => ({
          ...positionPermission,
        }),
      );

      return new ListPermissionPositionByPositionIdDtoOut(
        positionPermissions,
        positionPermissionsDtoOut.total,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ListPermissionPositionByPositionIdUseCase',
          error,
          appFile: __filename,
          context: {
            positionId: dtoIn.positionId,
            officeId: dtoIn.officeId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on list permission position by position id use case';

      throw new Error(message);
    }
  }
}
