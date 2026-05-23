import { Injectable } from '@nestjs/common';
import { GetAllPermissionsByUniqueIdsDtoIn } from '../../../permissions/services/get-all-permissions-by-unique-ids/dtos/get-all-permissions-by-unique-ids.dto-in';
import { GetAllPermissionsByUniqueIdsService } from '../../../permissions/services/get-all-permissions-by-unique-ids/get-all-permissions-by-unique-ids.service';
import { GetAllPositionPermissionsByPositionIdsDtoIn } from '../../../position-permissions/services/get-all-position-permissions-by-position-ids/dtos/get-all-position-permissions-by-position-ids.dto-in';
import { GetAllPositionPermissionsByPositionIdsService } from '../../../position-permissions/services/get-all-position-permissions-by-position-ids/get-all-position-permissions-by-position-ids.service';
import { GetAllPositionsByUniqueIdsDtoIn } from '../../../positions/services/get-all-positions-by-unique-ids/dtos/get-all-positions-by-unique-ids.dto-in';
import { GetAllPositionsByUniqueIdsService } from '../../../positions/services/get-all-positions-by-unique-ids/get-all-positions-by-unique-ids.service';
import { GetAllUserPositionsByUserCustomerIdDtoIn } from '../../../user-positions/services/get-all-user-positions-by-user-customer-id/dtos/get-all-user-positions-by-user-customer-id.dto-in';
import { GetAllUserPositionsByUserCustomerIdService } from '../../../user-positions/services/get-all-user-positions-by-user-customer-id/get-all-user-positions-by-user-customer-id.service';
import { CheckUserPermissionDtoIn } from './dtos/check-user-permission.dto-in';
import { CheckUserPermissionDtoOut } from './dtos/check-user-permission.dto-out';

@Injectable()
export class CheckUserPermissionService {
  constructor(
    private readonly getAllUserPositionsByUserCustomerIdService: GetAllUserPositionsByUserCustomerIdService,
    private readonly getAllPositionsByUniqueIdsService: GetAllPositionsByUniqueIdsService,
    private readonly getAllPositionPermissionsByPositionIdsService: GetAllPositionPermissionsByPositionIdsService,
    private readonly getAllPermissionsByUniqueIdsService: GetAllPermissionsByUniqueIdsService,
  ) {}

  async exec(
    dtoIn: CheckUserPermissionDtoIn,
  ): Promise<CheckUserPermissionDtoOut> {
    try {
      const userPositionsDtoOut =
        await this.getAllUserPositionsByUserCustomerIdService.exec(
          new GetAllUserPositionsByUserCustomerIdDtoIn(dtoIn.userCustomerId),
        );

      const activeUserPositions = userPositionsDtoOut.items.filter(
        (item) => item.status === 'active',
      );

      if (activeUserPositions.length === 0) {
        return new CheckUserPermissionDtoOut(
          false,
          false,
          dtoIn.requiredAction,
          dtoIn.requiredEntity,
          [],
          [],
          [],
          [],
          null,
        );
      }

      const positionIds = activeUserPositions.map((item) => item.positionId);

      const positionsDtoOut = await this.getAllPositionsByUniqueIdsService.exec(
        new GetAllPositionsByUniqueIdsDtoIn(positionIds),
      );

      const activePositions = positionsDtoOut.items.filter(
        (item) => item.status === 'active',
      );

      const isAdministrator = activePositions.some(
        (position) => position.slug === 'administrator',
      );

      if (isAdministrator) {
        return new CheckUserPermissionDtoOut(
          true,
          true,
          dtoIn.requiredAction,
          dtoIn.requiredEntity,
          activePositions,
          activeUserPositions,
          [],
          [],
          null,
        );
      }

      if (activePositions.length === 0) {
        return new CheckUserPermissionDtoOut(
          false,
          false,
          dtoIn.requiredAction,
          dtoIn.requiredEntity,
          [],
          activeUserPositions,
          [],
          [],
          null,
        );
      }

      const activePositionIds = activePositions.map((item) => item._id);

      const positionPermissionsDtoOut =
        await this.getAllPositionPermissionsByPositionIdsService.exec(
          new GetAllPositionPermissionsByPositionIdsDtoIn(activePositionIds),
        );

      const activePositionPermissions =
        positionPermissionsDtoOut.items.filter((item) => item.status === 'active');

      if (activePositionPermissions.length === 0) {
        return new CheckUserPermissionDtoOut(
          false,
          false,
          dtoIn.requiredAction,
          dtoIn.requiredEntity,
          activePositions,
          activeUserPositions,
          [],
          [],
          null,
        );
      }

      const permissionIds = [
        ...new Set(
          activePositionPermissions.map((item) => item.permissionId),
        ),
      ];

      const permissionsDtoOut =
        await this.getAllPermissionsByUniqueIdsService.exec(
          new GetAllPermissionsByUniqueIdsDtoIn(permissionIds),
        );

      const activePermissions = permissionsDtoOut.items.filter(
        (item) => item.status === 'active',
      );

      const matchedPermission = activePermissions.find((permission) => {
        const actionMatches = permission.action === dtoIn.requiredAction;

        const entityMatches =
          dtoIn.requiredEntity === null ||
          permission.entity === dtoIn.requiredEntity;

        return actionMatches && entityMatches;
      });

      return new CheckUserPermissionDtoOut(
        Boolean(matchedPermission),
        false,
        dtoIn.requiredAction,
        dtoIn.requiredEntity,
        activePositions,
        activeUserPositions,
        activePositionPermissions,
        activePermissions,
        matchedPermission ?? null,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on check user permission';

      throw new Error(message);
    }
  }
}