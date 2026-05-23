import { Inject, Injectable } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import type {
  IUserPositionsRepository,
  UserPositionRow,
} from '../../entities/user-positions-repository.interface';
import { USER_POSITIONS_REPOSITORY } from '../../tokens/user-positions.tokens';
import { UpdateUserPositionDtoIn } from './dtos/update-user-position.dto-in';
import { UpdateUserPositionDtoOut } from './dtos/update-user-position.dto-out';

@Injectable()
export class UpdateUserPositionService {
  constructor(
    @Inject(USER_POSITIONS_REPOSITORY)
    private readonly repository: IUserPositionsRepository,
    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(dtoIn: UpdateUserPositionDtoIn): Promise<UpdateUserPositionDtoOut> {
    try {
      const currentRow = await this.repository.findByUniqueId(dtoIn._id);

      if (!currentRow) {
        throw new Error('user position not found');
      }

      const newDataForHistory = this.removeNullValues({
        userCustomerId: dtoIn.userCustomerId,
        positionId: dtoIn.positionId,
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
        user_customer_id: dtoIn.userCustomerId,
        position_id: dtoIn.positionId,
        config: dtoIn.config,
        changes_history: historyDtoOut.hasChanges
          ? historyDtoOut.changesHistory
          : currentRow.changesHistory,
        status: dtoIn.status,
      });

      return new UpdateUserPositionDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update user position';

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

  private buildOldData(row: UserPositionRow): Record<string, unknown> {
    return {
      userCustomerId: row.userCustomerId,
      positionId: row.positionId,
      config: row.config,
      status: row.status,
    };
  }
}