import { Inject, Injectable } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import type {
  IPositionPermissionsRepository,
  PositionPermissionRow,
} from '../../entities/position-permissions-repository.interface';
import { POSITION_PERMISSIONS_REPOSITORY } from '../../tokens/position-permissions.tokens';
import { UpdatePositionPermissionDtoIn } from './dtos/update-position-permission.dto-in';
import { UpdatePositionPermissionDtoOut } from './dtos/update-position-permission.dto-out';

@Injectable()
export class UpdatePositionPermissionService {
  constructor(
    @Inject(POSITION_PERMISSIONS_REPOSITORY)
    private readonly repository: IPositionPermissionsRepository,
    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: UpdatePositionPermissionDtoIn,
  ): Promise<UpdatePositionPermissionDtoOut> {
    try {
      const currentRow = await this.repository.findByUniqueId(dtoIn._id);

      if (!currentRow) {
        throw new Error('position permission not found');
      }

      const newDataForHistory = this.removeNullValues({
        positionId: dtoIn.positionId,
        permissionId: dtoIn.permissionId,
        config: dtoIn.config,
        status: dtoIn.status,
      });

      const historyDtoOut = this.buildChangesHistoryService.exec(
        new BuildChangesHistoryDtoIn({
          currentChangesHistory: currentRow.changesHistory,
          oldData: this.buildOldData(currentRow),
          newData: newDataForHistory,
          source: dtoIn.source,
        }),
      );

      const row = await this.repository.updateByUniqueId(dtoIn._id, {
        position_id: dtoIn.positionId,
        permission_id: dtoIn.permissionId,
        config: dtoIn.config,
        changes_history: historyDtoOut.hasChanges
          ? historyDtoOut.changesHistory
          : currentRow.changesHistory,
        status: dtoIn.status,
      });

      return new UpdatePositionPermissionDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update position permission';

      throw new Error(message);
    }
  }

  private removeNullValues(
    data: Record<string, unknown>,
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== null),
    );
  }

  private buildOldData(
    row: PositionPermissionRow,
  ): Record<string, unknown> {
    return {
      positionId: row.positionId,
      permissionId: row.permissionId,
      config: row.config,
      status: row.status,
    };
  }
}