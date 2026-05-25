import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { GetAllPermissionsByUniqueIdsDtoIn } from '../../modules/permissions/services/get-all-permissions-by-unique-ids/dtos/get-all-permissions-by-unique-ids.dto-in';
import { GetAllPermissionsByUniqueIdsService } from '../../modules/permissions/services/get-all-permissions-by-unique-ids/get-all-permissions-by-unique-ids.service';
import { CreatePositionPermissionDtoIn } from '../../modules/position-permissions/services/create-position-permission/dtos/create-position-permission.dto-in';
import { CreatePositionPermissionService } from '../../modules/position-permissions/services/create-position-permission/create-position-permission.service';
import { GetAllPositionPermissionsByPositionIdDtoIn } from '../../modules/position-permissions/services/get-all-position-permissions-by-position-id/dtos/get-all-position-permissions-by-position-id.dto-in';
import { GetAllPositionPermissionsByPositionIdService } from '../../modules/position-permissions/services/get-all-position-permissions-by-position-id/get-all-position-permissions-by-position-id.service';
import { UpdatePositionPermissionDtoIn } from '../../modules/position-permissions/services/update-position-permission/dtos/update-position-permission.dto-in';
import { UpdatePositionPermissionService } from '../../modules/position-permissions/services/update-position-permission/update-position-permission.service';
import { FindPositionByUniqueIdDtoIn } from '../../modules/positions/services/find-position-by-unique-id/dtos/find-position-by-unique-id.dto-in';
import { FindPositionByUniqueIdService } from '../../modules/positions/services/find-position-by-unique-id/find-position-by-unique-id.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { SyncPositionPermissionsDtoIn } from './dtos/sync-position-permissions.dto-in';
import { SyncPositionPermissionsDtoOut } from './dtos/sync-position-permissions.dto-out';
import type { PositionPermissionRow } from '../../modules/position-permissions/entities/position-permissions-repository.interface';

@Injectable()
export class SyncPositionPermissionsUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findPositionByUniqueIdService: FindPositionByUniqueIdService,
    private readonly getAllPermissionsByUniqueIdsService: GetAllPermissionsByUniqueIdsService,
    private readonly getAllPositionPermissionsByPositionIdService: GetAllPositionPermissionsByPositionIdService,
    private readonly createPositionPermissionService: CreatePositionPermissionService,
    private readonly updatePositionPermissionService: UpdatePositionPermissionService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: SyncPositionPermissionsDtoIn,
  ): Promise<SyncPositionPermissionsDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'syncPositionPermissions',
          requiredEntity: 'position_permissions',
        }),
      );

      const positionDtoOut = await this.findPositionByUniqueIdService.exec(
        new FindPositionByUniqueIdDtoIn(dtoIn.positionId),
      );

      if (positionDtoOut.position.status !== 'active') {
        throw new Error('position is not active');
      }

      const permissionsDtoOut =
        await this.getAllPermissionsByUniqueIdsService.exec(
          new GetAllPermissionsByUniqueIdsDtoIn(dtoIn.permissionIds),
        );

      const foundPermissionIds = permissionsDtoOut.items.map((item) => item._id);

      const missingPermissionIds = dtoIn.permissionIds.filter(
        (permissionId) => !foundPermissionIds.includes(permissionId),
      );

      if (missingPermissionIds.length > 0) {
        throw new Error(
          `permissions not found: ${missingPermissionIds.join(', ')}`,
        );
      }

      const inactivePermissions = permissionsDtoOut.items.filter(
        (item) => item.status !== 'active',
      );

      if (inactivePermissions.length > 0) {
        throw new Error(
          `permissions are not active: ${inactivePermissions
            .map((item) => item._id)
            .join(', ')}`,
        );
      }

      const currentPositionPermissionsDtoOut =
        await this.getAllPositionPermissionsByPositionIdService.exec(
          new GetAllPositionPermissionsByPositionIdDtoIn(dtoIn.positionId),
        );

      const requestedPermissionIds = [...new Set(dtoIn.permissionIds)];

      const created: PositionPermissionRow[] = [];
      const activated: PositionPermissionRow[] = [];
      const inactivated: PositionPermissionRow[] = [];
      const kept: PositionPermissionRow[] = [];

      const currentByPermissionId = new Map(
        currentPositionPermissionsDtoOut.items.map((item) => [
          item.permissionId,
          item,
        ]),
      );

      for (const permissionId of requestedPermissionIds) {
        const current = currentByPermissionId.get(permissionId);

        if (!current) {
          const createdDtoOut =
            await this.createPositionPermissionService.exec(
              new CreatePositionPermissionDtoIn({
                positionId: dtoIn.positionId,
                permissionId,
                config: {
                  source: dtoIn.source,
                },
                status: 'active',
              }),
            );

          created.push({
            id: createdDtoOut.id,
            _id: createdDtoOut._id,
            positionId: createdDtoOut.positionId,
            permissionId: createdDtoOut.permissionId,
            config: createdDtoOut.config,
            changesHistory: createdDtoOut.changesHistory,
            status: createdDtoOut.status,
            createdAt: createdDtoOut.createdAt,
            updatedAt: createdDtoOut.updatedAt,
          });

          continue;
        }

        if (current.status !== 'active') {
          const activatedDtoOut =
            await this.updatePositionPermissionService.exec(
              new UpdatePositionPermissionDtoIn({
                _id: current._id,
                status: 'active',
                source: dtoIn.source,
              }),
            );

          activated.push(activatedDtoOut.positionPermission);

          continue;
        }

        kept.push(current);
      }

      for (const current of currentPositionPermissionsDtoOut.items) {
        const shouldRemainActive = requestedPermissionIds.includes(
          current.permissionId,
        );

        if (shouldRemainActive) {
          continue;
        }

        if (current.status !== 'active') {
          continue;
        }

        const inactivatedDtoOut =
          await this.updatePositionPermissionService.exec(
            new UpdatePositionPermissionDtoIn({
              _id: current._id,
              status: 'inactive',
              source: dtoIn.source,
            }),
          );

        inactivated.push(inactivatedDtoOut.positionPermission);
      }

      return new SyncPositionPermissionsDtoOut(
        positionDtoOut.position,
        permissionsDtoOut.items,
        requestedPermissionIds,
        created,
        activated,
        inactivated,
        kept,
        requestedPermissionIds.length,
        created.length,
        activated.length,
        inactivated.length,
        kept.length,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'SyncPositionPermissionsUseCase',
          error,
          appFile: __filename,
          context: {
            positionId: dtoIn.positionId,
            permissionIds: dtoIn.permissionIds,
            source: dtoIn.source,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on sync position permissions use case';

      throw new Error(message);
    }
  }
}