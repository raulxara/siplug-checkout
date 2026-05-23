import { Inject, Injectable } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import type {
  IPositionsRepository,
  PositionRow,
} from '../../entities/positions-repository.interface';
import { POSITIONS_REPOSITORY } from '../../tokens/positions.tokens';
import { UpdatePositionDtoIn } from './dtos/update-position.dto-in';
import { UpdatePositionDtoOut } from './dtos/update-position.dto-out';

@Injectable()
export class UpdatePositionService {
  constructor(
    @Inject(POSITIONS_REPOSITORY)
    private readonly repository: IPositionsRepository,
    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(dtoIn: UpdatePositionDtoIn): Promise<UpdatePositionDtoOut> {
    try {
      const currentRow = await this.repository.findByUniqueId(dtoIn._id);

      if (!currentRow) {
        throw new Error('position not found');
      }

      const newDataForHistory = this.removeNullValues({
        officeId: dtoIn.officeId,
        name: dtoIn.name,
        slug: dtoIn.slug,
        description: dtoIn.description,
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
        config: dtoIn.config,
        changes_history: historyDtoOut.hasChanges
          ? historyDtoOut.changesHistory
          : currentRow.changesHistory,
        status: dtoIn.status,
      });

      return new UpdatePositionDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on update position';

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

  private buildOldData(row: PositionRow): Record<string, unknown> {
    return {
      officeId: row.officeId,
      name: row.name,
      slug: row.slug,
      description: row.description,
      config: row.config,
      status: row.status,
    };
  }
}