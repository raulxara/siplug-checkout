import { Inject, Injectable } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import type {
  IUserAccessCodesRepository,
  UserAccessCodeRow,
} from '../../entities/user-access-codes-repository.interface';
import { USER_ACCESS_CODES_REPOSITORY } from '../../tokens/user-access-codes.tokens';
import { UpdateUserAccessCodeDtoIn } from './dtos/update-user-access-code.dto-in';
import { UpdateUserAccessCodeDtoOut } from './dtos/update-user-access-code.dto-out';

@Injectable()
export class UpdateUserAccessCodeService {
  constructor(
    @Inject(USER_ACCESS_CODES_REPOSITORY)
    private readonly repository: IUserAccessCodesRepository,
    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: UpdateUserAccessCodeDtoIn,
  ): Promise<UpdateUserAccessCodeDtoOut> {
    try {
      const currentRow = await this.repository.findByUniqueId(dtoIn._id);

      if (!currentRow) {
        throw new Error('user access code not found');
      }

      const newDataForHistory = this.removeNullValues({
        channel: dtoIn.channel,
        destination: dtoIn.destination,
        code: dtoIn.code,
        expiresAt: dtoIn.expiresAt,
        usedAt: dtoIn.usedAt,
        sentAt: dtoIn.sentAt,
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
        channel: dtoIn.channel,
        destination: dtoIn.destination,
        code: dtoIn.code,
        expires_at: dtoIn.expiresAt,
        used_at: dtoIn.usedAt,
        sent_at: dtoIn.sentAt,
        config: dtoIn.config,
        changes_history: historyDtoOut.hasChanges
          ? historyDtoOut.changesHistory
          : currentRow.changesHistory,
        status: dtoIn.status,
      });

      return new UpdateUserAccessCodeDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update user access code';

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

  private buildOldData(row: UserAccessCodeRow): Record<string, unknown> {
    return {
      channel: row.channel,
      destination: row.destination,
      code: row.code,
      expiresAt: row.expiresAt,
      usedAt: row.usedAt,
      sentAt: row.sentAt,
      config: row.config,
      status: row.status,
    };
  }
}