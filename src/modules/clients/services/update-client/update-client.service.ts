import { Inject, Injectable } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import { HashPasswordService } from '../../../../common/services/security/hash-password.service';
import type {
  ClientRow,
  IClientsRepository,
} from '../../entities/clients-repository.interface';
import { CLIENTS_REPOSITORY } from '../../tokens/clients.tokens';
import { UpdateClientDtoIn } from './dtos/update-client.dto-in';
import { UpdateClientDtoOut } from './dtos/update-client.dto-out';

@Injectable()
export class UpdateClientService {
  constructor(
    @Inject(CLIENTS_REPOSITORY)
    private readonly repository: IClientsRepository,
    private readonly buildChangesHistoryService: BuildChangesHistoryService,
    private readonly hashPasswordService: HashPasswordService,
  ) {}

  async exec(dtoIn: UpdateClientDtoIn): Promise<UpdateClientDtoOut> {
    try {
      const currentRow = await this.repository.findByUniqueId(dtoIn._id);

      if (!currentRow) {
        throw new Error('client not found');
      }

      let hashedPassword: string | null = null;

      if (dtoIn.password !== null && dtoIn.password.trim() !== '') {
        hashedPassword = await this.hashPasswordService.exec(dtoIn.password);
      }

      const newDataForHistory = this.removeNullValues({
        officeId: dtoIn.officeId,
        customerId: dtoIn.customerId,
        userType: dtoIn.userType,
        username: dtoIn.username,
        password: hashedPassword !== null ? '[updated]' : null,
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
        customer_id: dtoIn.customerId,
        user_type: dtoIn.userType,
        username: dtoIn.username,
        password: hashedPassword,
        config: dtoIn.config,
        changes_history: historyDtoOut.hasChanges
          ? historyDtoOut.changesHistory
          : currentRow.changesHistory,
        status: dtoIn.status,
      });

      return new UpdateClientDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on update client';

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

  private buildOldData(row: ClientRow): Record<string, unknown> {
    return {
      officeId: row.officeId,
      customerId: row.customerId,
      userType: row.userType,
      username: row.username,
      config: row.config,
      status: row.status,
    };
  }
}