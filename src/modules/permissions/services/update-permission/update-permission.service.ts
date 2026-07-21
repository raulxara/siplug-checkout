import { Inject, Injectable } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import type {
  IPermissionsRepository,
  PermissionRow,
} from '../../entities/permissions-repository.interface';
import { PERMISSIONS_REPOSITORY } from '../../tokens/permissions.tokens';
import { UpdatePermissionDtoIn } from './dtos/update-permission.dto-in';
import { UpdatePermissionDtoOut } from './dtos/update-permission.dto-out';

@Injectable()
export class UpdatePermissionService {
  constructor(
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly repository: IPermissionsRepository,
    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(dtoIn: UpdatePermissionDtoIn): Promise<UpdatePermissionDtoOut> {
    try {
      const currentRow = await this.repository.findByUniqueId(dtoIn._id);

      if (!currentRow) {
        throw new Error('permission not found');
      }

      const newDataForHistory = this.removeNullValues({
        officeId: dtoIn.officeId,
        name: dtoIn.name,
        slug: dtoIn.slug,
        description: dtoIn.description,
        entity: dtoIn.entity,
        action: dtoIn.action,
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
        office_id: dtoIn.officeId,
        name: dtoIn.name,
        slug: dtoIn.slug,
        description: dtoIn.description,
        entity: dtoIn.entity,
        action: dtoIn.action,
        config: dtoIn.config,
        changes_history: historyDtoOut.hasChanges
          ? historyDtoOut.changesHistory
          : currentRow.changesHistory,
        status: dtoIn.status,
      });

      return new UpdatePermissionDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on update permission';

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

  private buildOldData(row: PermissionRow): Record<string, unknown> {
    return {
      officeId: row.officeId,
      name: row.name,
      slug: row.slug,
      description: row.description,
      entity: row.entity,
      action: row.action,
      config: row.config,
      status: row.status,
    };
  }
}