import { Inject, Injectable } from '@nestjs/common';
import type {
  ISubscriptionInvoicesRepository,
  SubscriptionInvoiceRow,
} from '../../entities/subscription-invoices-repository.interface';
import { SUBSCRIPTION_INVOICES_REPOSITORY } from '../../tokens/subscription-invoices.tokens';
import { UpdateSubscriptionInvoiceDtoIn } from './dtos/update-subscription-invoice.dto-in';
import { UpdateSubscriptionInvoiceDtoOut } from './dtos/update-subscription-invoice.dto-out';

@Injectable()
export class UpdateSubscriptionInvoiceService {
  constructor(
    @Inject(SUBSCRIPTION_INVOICES_REPOSITORY)
    private readonly repository: ISubscriptionInvoicesRepository,
  ) {}

  async exec(
    dtoIn: UpdateSubscriptionInvoiceDtoIn,
  ): Promise<UpdateSubscriptionInvoiceDtoOut> {
    try {
      const current = await this.repository.findByUniqueId(dtoIn._id);

      if (!current) {
        throw new Error('subscription invoice not found');
      }

      const changesHistory = this.buildChangesHistory({
        current,
        dtoIn,
      });

      const updated = await this.repository.updateByUniqueId(dtoIn._id, {
        payment_transaction_id: dtoIn.paymentTransactionId,
        gateway_invoice_id: dtoIn.gatewayInvoiceId,
        last_attempt_at: dtoIn.lastAttemptAt,
        attempt_number: dtoIn.attemptNumber,
        paid_at: dtoIn.paidAt,
        metadata: dtoIn.metadata,
        config: dtoIn.config,
        status: dtoIn.status,
        changes_history: changesHistory,
      });

      return new UpdateSubscriptionInvoiceDtoOut(updated);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update subscription invoice';

      throw new Error(message);
    }
  }

  private buildChangesHistory(params: {
    current: SubscriptionInvoiceRow;
    dtoIn: UpdateSubscriptionInvoiceDtoIn;
  }): Array<Record<string, unknown>> {
    const previous = params.current.changesHistory ?? [];

    const changes: Record<string, unknown> = {
      source: params.dtoIn.source,
      changedAt: new Date().toISOString(),
      old: {},
      new: {},
    };

    const oldValues = changes.old as Record<string, unknown>;
    const newValues = changes.new as Record<string, unknown>;

    this.appendChange(
      oldValues,
      newValues,
      'paymentTransactionId',
      params.current.paymentTransactionId,
      params.dtoIn.paymentTransactionId,
    );

    this.appendChange(
      oldValues,
      newValues,
      'gatewayInvoiceId',
      params.current.gatewayInvoiceId,
      params.dtoIn.gatewayInvoiceId,
    );

    this.appendChange(
      oldValues,
      newValues,
      'lastAttemptAt',
      params.current.lastAttemptAt,
      params.dtoIn.lastAttemptAt,
    );

    this.appendChange(
      oldValues,
      newValues,
      'attemptNumber',
      params.current.attemptNumber,
      params.dtoIn.attemptNumber,
    );

    this.appendChange(
      oldValues,
      newValues,
      'paidAt',
      params.current.paidAt,
      params.dtoIn.paidAt,
    );

    this.appendChange(
      oldValues,
      newValues,
      'status',
      params.current.status,
      params.dtoIn.status,
    );

    return [...previous, changes];
  }

  private appendChange(
    oldValues: Record<string, unknown>,
    newValues: Record<string, unknown>,
    field: string,
    oldValue: unknown,
    newValue: unknown,
  ): void {
    if (newValue === null || newValue === undefined) {
      return;
    }

    if (oldValue === newValue) {
      return;
    }

    oldValues[field] = oldValue;
    newValues[field] = newValue;
  }
}
