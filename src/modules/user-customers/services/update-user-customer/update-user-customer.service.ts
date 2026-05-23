import { Inject, Injectable } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import type {
  IUserCustomersRepository,
  UserCustomerRow,
} from '../../entities/user-customers-repository.interface';
import { USER_CUSTOMERS_REPOSITORY } from '../../tokens/user-customers.tokens';
import { UpdateUserCustomerDtoIn } from './dtos/update-user-customer.dto-in';
import { UpdateUserCustomerDtoOut } from './dtos/update-user-customer.dto-out';

@Injectable()
export class UpdateUserCustomerService {
  constructor(
    @Inject(USER_CUSTOMERS_REPOSITORY)
    private readonly repository: IUserCustomersRepository,
    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: UpdateUserCustomerDtoIn,
  ): Promise<UpdateUserCustomerDtoOut> {
    try {
      const currentRow = await this.repository.findByUniqueId(dtoIn._id);

      if (!currentRow) {
        throw new Error('user customer not found');
      }

      const newDataForHistory = this.removeNullValues({
        clientId: dtoIn.clientId,
        profileId: dtoIn.profileId,
        token: dtoIn.token,
        twoFaRequired: dtoIn.twoFaRequired,
        twoFaActive: dtoIn.twoFaActive,
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
        client_id: dtoIn.clientId,
        profile_id: dtoIn.profileId,
        token: dtoIn.token,
        two_fa_required: dtoIn.twoFaRequired,
        two_fa_active: dtoIn.twoFaActive,
        config: dtoIn.config,
        changes_history: historyDtoOut.hasChanges
          ? historyDtoOut.changesHistory
          : currentRow.changesHistory,
        status: dtoIn.status,
      });

      return new UpdateUserCustomerDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update user customer';

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

  private buildOldData(row: UserCustomerRow): Record<string, unknown> {
    return {
      clientId: row.clientId,
      profileId: row.profileId,
      token: row.token,
      twoFaRequired: row.twoFaRequired,
      twoFaActive: row.twoFaActive,
      config: row.config,
      status: row.status,
    };
  }
}