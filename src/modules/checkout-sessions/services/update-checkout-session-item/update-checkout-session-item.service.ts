import { Inject, Injectable } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import type {
  CheckoutSessionItemRow,
  ICheckoutSessionItemsRepository,
} from '../../entities/checkout-session-items-repository.interface';
import { CHECKOUT_SESSION_ITEMS_REPOSITORY } from '../../tokens/checkout-sessions.tokens';
import { UpdateCheckoutSessionItemDtoIn } from './dtos/update-checkout-session-item.dto-in';
import { UpdateCheckoutSessionItemDtoOut } from './dtos/update-checkout-session-item.dto-out';

@Injectable()
export class UpdateCheckoutSessionItemService {
  constructor(
    @Inject(CHECKOUT_SESSION_ITEMS_REPOSITORY)
    private readonly repository: ICheckoutSessionItemsRepository,
    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: UpdateCheckoutSessionItemDtoIn,
  ): Promise<UpdateCheckoutSessionItemDtoOut> {
    try {
      const currentRow = await this.repository.findByUniqueId(dtoIn._id);

      if (!currentRow) {
        throw new Error('checkout session item not found');
      }

      const newDataForHistory = this.removeNullValues({
        checkoutSessionId: dtoIn.checkoutSessionId,
        itemRef: dtoIn.itemRef,
        itemType: dtoIn.itemType,
        name: dtoIn.name,
        description: dtoIn.description,
        quantity: dtoIn.quantity,
        unitAmount: dtoIn.unitAmount,
        totalAmount: dtoIn.totalAmount,
        metadata: dtoIn.metadata,
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
        checkout_session_id: dtoIn.checkoutSessionId,
        item_ref: dtoIn.itemRef,
        item_type: dtoIn.itemType,
        name: dtoIn.name,
        description: dtoIn.description,
        quantity: dtoIn.quantity,
        unit_amount: dtoIn.unitAmount,
        total_amount: dtoIn.totalAmount,
        metadata: dtoIn.metadata,
        config: dtoIn.config,
        changes_history: historyDtoOut.hasChanges
          ? historyDtoOut.changesHistory
          : currentRow.changesHistory,
        status: dtoIn.status,
      });

      return new UpdateCheckoutSessionItemDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update checkout session item';

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

  private buildOldData(row: CheckoutSessionItemRow): Record<string, unknown> {
    return {
      checkoutSessionId: row.checkoutSessionId,
      itemRef: row.itemRef,
      itemType: row.itemType,
      name: row.name,
      description: row.description,
      quantity: row.quantity,
      unitAmount: row.unitAmount,
      totalAmount: row.totalAmount,
      metadata: row.metadata,
      config: row.config,
      status: row.status,
    };
  }
}