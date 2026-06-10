import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { PaymentSplitEntity } from '../entities/payment-split.entity';
import type {
  IPaymentSplitsRepository,
  PaymentSplitRow,
} from '../entities/payment-splits-repository.interface';

@Injectable()
export class PaymentSplitsRepository implements IPaymentSplitsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: PaymentSplitEntity): Promise<PaymentSplitEntity> {
    const data: Prisma.PaymentSplitUncheckedCreateInput = {
      unique_id: entity._id ?? generateUniqueId(),

      office_id: entity.officeId,
      client_id: entity.clientId,
      checkout_session_id: entity.checkoutSessionId,
      payment_transaction_id: entity.paymentTransactionId,
      subscription_id: entity.subscriptionId,
      subscription_invoice_id: entity.subscriptionInvoiceId,
      split_rule_id: entity.splitRuleId,

      gateway_provider: entity.gatewayProvider,
      gateway_split_id: entity.gatewaySplitId,

      amount: entity.amount,
      currency: entity.currency,

      provider_payload:
        entity.providerPayload === null
          ? Prisma.JsonNull
          : (entity.providerPayload as Prisma.InputJsonValue),

      provider_response:
        entity.providerResponse === null
          ? Prisma.JsonNull
          : (entity.providerResponse as Prisma.InputJsonValue),

      gateway_response:
        entity.gatewayResponse === null
          ? Prisma.JsonNull
          : (entity.gatewayResponse as Prisma.InputJsonValue),

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
    };

    const model = await this.prisma.paymentSplit.create({
      data,
    });

    const fresh = new PaymentSplitEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;

    fresh.officeId = model.office_id;
    fresh.clientId = model.client_id;
    fresh.checkoutSessionId = model.checkout_session_id;
    fresh.paymentTransactionId = model.payment_transaction_id;
    fresh.subscriptionId = model.subscription_id;
    fresh.subscriptionInvoiceId = model.subscription_invoice_id;
    fresh.splitRuleId = model.split_rule_id;

    fresh.gatewayProvider = model.gateway_provider;
    fresh.gatewaySplitId = model.gateway_split_id;

    fresh.amount = model.amount;
    fresh.currency = model.currency;

    fresh.providerPayload = this.parseJsonObject(model.provider_payload);
    fresh.providerResponse = this.parseJsonObject(model.provider_response);
    fresh.gatewayResponse = this.parseJsonObject(model.gateway_response);
    fresh.metadata = this.parseJsonObject(model.metadata);
    fresh.config = this.parseJsonObject(model.config);
    fresh.changesHistory = this.parseChangesHistory(model.changes_history);

    fresh.status = model.status;
    fresh.createdAt = formatDateTime(model.created_at);
    fresh.updatedAt = formatDateTime(model.updated_at);

    return fresh;
  }

  async updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<PaymentSplitRow> {
    const updateData: Prisma.PaymentSplitUncheckedUpdateInput = {};

    if (data.gateway_split_id !== undefined && data.gateway_split_id !== null) {
      updateData.gateway_split_id = String(data.gateway_split_id);
    }

    if (data.provider_payload !== undefined && data.provider_payload !== null) {
      updateData.provider_payload =
        data.provider_payload as Prisma.InputJsonValue;
    }

    if (
      data.provider_response !== undefined &&
      data.provider_response !== null
    ) {
      updateData.provider_response =
        data.provider_response as Prisma.InputJsonValue;
    }

    if (data.gateway_response !== undefined && data.gateway_response !== null) {
      updateData.gateway_response =
        data.gateway_response as Prisma.InputJsonValue;
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

    const model = await this.prisma.paymentSplit.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<PaymentSplitRow | null> {
    const model = await this.prisma.paymentSplit.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAllByPaymentTransactionId(
    paymentTransactionId: string,
  ): Promise<PaymentSplitRow[]> {
    const rows = await this.prisma.paymentSplit.findMany({
      where: {
        payment_transaction_id: paymentTransactionId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  private toRow(model: {
    id: number;
    unique_id: string;

    office_id: string;
    client_id: string;
    checkout_session_id: string | null;
    payment_transaction_id: string;
    subscription_id: string | null;
    subscription_invoice_id: string | null;
    split_rule_id: string | null;

    gateway_provider: string;
    gateway_split_id: string | null;

    amount: number;
    currency: string;

    provider_payload: Prisma.JsonValue | null;
    provider_response: Prisma.JsonValue | null;
    gateway_response: Prisma.JsonValue | null;
    metadata: Prisma.JsonValue | null;
    config: Prisma.JsonValue | null;
    changes_history: Prisma.JsonValue | null;

    status: string;
    created_at: Date;
    updated_at: Date;
  }): PaymentSplitRow {
    return {
      id: model.id,
      _id: model.unique_id,

      officeId: model.office_id,
      clientId: model.client_id,
      checkoutSessionId: model.checkout_session_id,
      paymentTransactionId: model.payment_transaction_id,
      subscriptionId: model.subscription_id,
      subscriptionInvoiceId: model.subscription_invoice_id,
      splitRuleId: model.split_rule_id,

      gatewayProvider: model.gateway_provider,
      gatewaySplitId: model.gateway_split_id,

      amount: model.amount,
      currency: model.currency,

      providerPayload: this.parseJsonObject(model.provider_payload),
      providerResponse: this.parseJsonObject(model.provider_response),
      gatewayResponse: this.parseJsonObject(model.gateway_response),
      metadata: this.parseJsonObject(model.metadata),
      config: this.parseJsonObject(model.config),
      changesHistory: this.parseChangesHistory(model.changes_history),

      status: model.status,
      createdAt: formatDateTime(model.created_at),
      updatedAt: formatDateTime(model.updated_at),
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
}
