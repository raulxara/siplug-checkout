import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { SubscriptionInvoiceEntity } from '../entities/subscription-invoice.entity';
import type {
  ISubscriptionInvoicesRepository,
  SubscriptionInvoiceRow,
} from '../entities/subscription-invoices-repository.interface';

@Injectable()
export class SubscriptionInvoicesRepository implements ISubscriptionInvoicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    entity: SubscriptionInvoiceEntity,
  ): Promise<SubscriptionInvoiceEntity> {
    const model = await this.prisma.subscriptionInvoice.create({
      data: {
        unique_id: entity._id ?? generateUniqueId(),

        subscription_id: entity.subscriptionId,
        subscription_cycle_id: entity.subscriptionCycleId,
        payment_transaction_id: entity.paymentTransactionId,

        invoice_number: entity.invoiceNumber,

        amount: entity.amount,
        currency: entity.currency,

        due_at: this.toNullableDate(entity.dueAt),
        paid_at: this.toNullableDate(entity.paidAt),

        attempt_number: entity.attemptNumber,
        external_reference: entity.externalReference,
        gateway_invoice_id: entity.gatewayInvoiceId,
        last_attempt_at: this.toNullableDate(entity.lastAttemptAt),

        metadata:
          entity.metadata === null
            ? Prisma.JsonNull
            : (entity.metadata as Prisma.InputJsonValue),

        config:
          entity.config === null
            ? Prisma.JsonNull
            : (entity.config as Prisma.InputJsonValue),

        changes_history:
          entity.changesHistory === null
            ? Prisma.JsonNull
            : (entity.changesHistory as Prisma.InputJsonValue),

        status: entity.status ?? 'created',
      },
    });

    const fresh = new SubscriptionInvoiceEntity(this);
    this.hydrateEntityFromModel(fresh, model);

    return fresh;
  }

  async updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<SubscriptionInvoiceRow> {
    const updateData: Prisma.SubscriptionInvoiceUncheckedUpdateInput = {};

    if (data.subscription_id !== undefined && data.subscription_id !== null) {
      updateData.subscription_id = String(data.subscription_id);
    }

    if (
      data.subscription_cycle_id !== undefined &&
      data.subscription_cycle_id !== null
    ) {
      updateData.subscription_cycle_id = String(data.subscription_cycle_id);
    }

    if (
      data.payment_transaction_id !== undefined &&
      data.payment_transaction_id !== null
    ) {
      updateData.payment_transaction_id = String(data.payment_transaction_id);
    }

    if (data.invoice_number !== undefined && data.invoice_number !== null) {
      updateData.invoice_number = String(data.invoice_number);
    }

    if (data.amount !== undefined && data.amount !== null) {
      updateData.amount = Number(data.amount);
    }

    if (data.currency !== undefined && data.currency !== null) {
      updateData.currency = String(data.currency);
    }

    if (data.due_at !== undefined && data.due_at !== null) {
      updateData.due_at = this.toNullableDate(String(data.due_at));
    }

    if (data.paid_at !== undefined && data.paid_at !== null) {
      updateData.paid_at = this.toNullableDate(String(data.paid_at));
    }

    if (data.attempt_number !== undefined && data.attempt_number !== null) {
      updateData.attempt_number = Number(data.attempt_number);
    }

    if (
      data.external_reference !== undefined &&
      data.external_reference !== null
    ) {
      updateData.external_reference = String(data.external_reference);
    }

    if (
      data.gateway_invoice_id !== undefined &&
      data.gateway_invoice_id !== null
    ) {
      updateData.gateway_invoice_id = String(data.gateway_invoice_id);
    }

    if (data.last_attempt_at !== undefined && data.last_attempt_at !== null) {
      updateData.last_attempt_at = this.toNullableDate(
        String(data.last_attempt_at),
      );
    }

    if (data.metadata !== undefined && data.metadata !== null) {
      updateData.metadata = data.metadata as Prisma.InputJsonValue;
    }

    if (data.config !== undefined && data.config !== null) {
      updateData.config = data.config as Prisma.InputJsonValue;
    }

    if (data.changes_history !== undefined && data.changes_history !== null) {
      updateData.changes_history =
        data.changes_history as Prisma.InputJsonValue;
    }

    if (data.status !== undefined && data.status !== null) {
      updateData.status = String(data.status);
    }

    const model = await this.prisma.subscriptionInvoice.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByPaymentTransactionId(
    paymentTransactionId: string,
  ): Promise<SubscriptionInvoiceRow | null> {
    const model = await this.prisma.subscriptionInvoice.findFirst({
      where: {
        payment_transaction_id: paymentTransactionId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findByGatewayInvoiceId(
    gatewayInvoiceId: string,
  ): Promise<SubscriptionInvoiceRow | null> {
    const model = await this.prisma.subscriptionInvoice.findFirst({
      where: {
        gateway_invoice_id: gatewayInvoiceId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findLatestBySubscriptionId(
    subscriptionId: string,
  ): Promise<SubscriptionInvoiceRow | null> {
    const model = await this.prisma.subscriptionInvoice.findFirst({
      where: {
        subscription_id: subscriptionId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<SubscriptionInvoiceRow[]> {
    const rows = await this.prisma.subscriptionInvoice.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByOfficeId(officeId: string): Promise<SubscriptionInvoiceRow[]> {
    const rows = await this.prisma.subscriptionInvoice.findMany({
      where: {
        subscription: {
          office_id: officeId,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async findByUniqueId(_id: string): Promise<SubscriptionInvoiceRow | null> {
    const model = await this.prisma.subscriptionInvoice.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findByInvoiceNumber(
    invoiceNumber: string,
  ): Promise<SubscriptionInvoiceRow | null> {
    const model = await this.prisma.subscriptionInvoice.findFirst({
      where: {
        invoice_number: invoiceNumber,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAllBySubscriptionId(
    subscriptionId: string,
  ): Promise<SubscriptionInvoiceRow[]> {
    const rows = await this.prisma.subscriptionInvoice.findMany({
      where: {
        subscription_id: subscriptionId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  private hydrateEntityFromModel(
    entity: SubscriptionInvoiceEntity,
    model: SubscriptionInvoicePrismaModel,
  ): void {
    const row = this.toRow(model);

    entity.id = row.id;
    entity._id = row._id;

    entity.subscriptionId = row.subscriptionId;
    entity.subscriptionCycleId = row.subscriptionCycleId;
    entity.paymentTransactionId = row.paymentTransactionId;

    entity.invoiceNumber = row.invoiceNumber;

    entity.amount = row.amount;
    entity.currency = row.currency;

    entity.dueAt = row.dueAt;
    entity.paidAt = row.paidAt;

    entity.attemptNumber = row.attemptNumber;
    entity.externalReference = row.externalReference;
    entity.gatewayInvoiceId = row.gatewayInvoiceId;
    entity.lastAttemptAt = row.lastAttemptAt;

    entity.metadata = row.metadata;
    entity.config = row.config;
    entity.changesHistory = row.changesHistory;

    entity.status = row.status;
    entity.createdAt = row.createdAt;
    entity.updatedAt = row.updatedAt;
  }

  private toRow(model: SubscriptionInvoicePrismaModel): SubscriptionInvoiceRow {
    return {
      id: model.id,
      _id: model.unique_id,

      subscriptionId: model.subscription_id,
      subscriptionCycleId: model.subscription_cycle_id,
      paymentTransactionId: model.payment_transaction_id,

      invoiceNumber: model.invoice_number,

      amount: model.amount,
      currency: model.currency,

      dueAt: model.due_at ? formatDateTime(model.due_at) : null,
      paidAt: model.paid_at ? formatDateTime(model.paid_at) : null,

      attemptNumber: model.attempt_number,
      externalReference: model.external_reference,
      gatewayInvoiceId: model.gateway_invoice_id,
      lastAttemptAt: model.last_attempt_at
        ? formatDateTime(model.last_attempt_at)
        : null,

      metadata: this.parseJsonObject(model.metadata),
      config: this.parseJsonObject(model.config),
      changesHistory: this.parseChangesHistory(model.changes_history),

      status: model.status,

      createdAt: formatDateTime(model.created_at),
      updatedAt: model.updated_at ? formatDateTime(model.updated_at) : null,
    };
  }

  private parseJsonObject(
    value: Prisma.JsonValue | null,
  ): Record<string, unknown> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }

  private parseChangesHistory(
    value: Prisma.JsonValue | null,
  ): Array<Record<string, unknown>> | null {
    if (!Array.isArray(value)) {
      return null;
    }

    return value as Array<Record<string, unknown>>;
  }

  private toNullableDate(value: string | null): Date | null {
    if (value === null || value.trim() === '') {
      return null;
    }

    return new Date(value);
  }
}

type SubscriptionInvoicePrismaModel = {
  id: number;
  unique_id: string;

  subscription_id: string;
  subscription_cycle_id: string | null;
  payment_transaction_id: string | null;

  invoice_number: string | null;

  amount: number;
  currency: string;

  due_at: Date | null;
  paid_at: Date | null;

  attempt_number: number;
  external_reference: string | null;
  gateway_invoice_id: string | null;
  last_attempt_at: Date | null;

  metadata: Prisma.JsonValue | null;
  config: Prisma.JsonValue | null;
  changes_history: Prisma.JsonValue | null;

  status: string;

  created_at: Date;
  updated_at: Date | null;
};
