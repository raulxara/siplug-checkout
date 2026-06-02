import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionInvoiceEntity } from '../../entities/subscription-invoice.entity';
import type {
  ISubscriptionInvoicesRepository,
  SubscriptionInvoiceRow,
} from '../../entities/subscription-invoices-repository.interface';
import { SUBSCRIPTION_INVOICES_REPOSITORY } from '../../tokens/subscription-invoices.tokens';
import { CreateSubscriptionInvoiceDtoIn } from './dtos/create-subscription-invoice.dto-in';
import { CreateSubscriptionInvoiceDtoOut } from './dtos/create-subscription-invoice.dto-out';

@Injectable()
export class CreateSubscriptionInvoiceService {
  constructor(
    @Inject(SUBSCRIPTION_INVOICES_REPOSITORY)
    private readonly repository: ISubscriptionInvoicesRepository,
  ) {}

  async exec(
    dtoIn: CreateSubscriptionInvoiceDtoIn,
  ): Promise<CreateSubscriptionInvoiceDtoOut> {
    try {
      const entity = new SubscriptionInvoiceEntity(this.repository);

      entity.subscriptionId = dtoIn.subscriptionId;
      entity.subscriptionCycleId = dtoIn.subscriptionCycleId;
      entity.paymentTransactionId = dtoIn.paymentTransactionId;

      entity.invoiceNumber = dtoIn.invoiceNumber;

      entity.amount = dtoIn.amount;
      entity.currency = dtoIn.currency;

      entity.dueAt = dtoIn.dueAt;
      entity.paidAt = dtoIn.paidAt;

      entity.attemptNumber = dtoIn.attemptNumber;
      entity.externalReference = dtoIn.externalReference;
      entity.gatewayInvoiceId = dtoIn.gatewayInvoiceId;
      entity.lastAttemptAt = dtoIn.lastAttemptAt;

      entity.metadata = dtoIn.metadata;
      entity.config = dtoIn.config;
      entity.status = dtoIn.status;

      const created = await entity.create();

      return new CreateSubscriptionInvoiceDtoOut(this.toRow(created));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on create subscription invoice';

      throw new Error(message);
    }
  }

  private toRow(entity: SubscriptionInvoiceEntity): SubscriptionInvoiceRow {
    return {
      id: this.requiredNumber(entity.id, 'subscription invoice id'),
      _id: this.requiredString(entity._id, 'subscription invoice _id'),

      subscriptionId: entity.subscriptionId,
      subscriptionCycleId: entity.subscriptionCycleId,
      paymentTransactionId: entity.paymentTransactionId,

      invoiceNumber: entity.invoiceNumber,

      amount: entity.amount,
      currency: entity.currency,

      dueAt: entity.dueAt,
      paidAt: entity.paidAt,

      attemptNumber: entity.attemptNumber,
      externalReference: entity.externalReference,
      gatewayInvoiceId: entity.gatewayInvoiceId,
      lastAttemptAt: entity.lastAttemptAt,

      metadata: entity.metadata,
      config: entity.config,
      changesHistory: entity.changesHistory,

      status: this.requiredString(entity.status, 'subscription invoice status'),

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private requiredNumber(value: number | null, field: string): number {
    if (value === null) {
      throw new Error(`${field} was not hydrated`);
    }

    return value;
  }

  private requiredString(value: string | null, field: string): string {
    if (value === null || value.trim() === '') {
      throw new Error(`${field} was not hydrated`);
    }

    return value;
  }
}