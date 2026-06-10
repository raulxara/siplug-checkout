import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { PaymentSplitRecipientEntity } from '../entities/payment-split-recipient.entity';
import type {
  IPaymentSplitRecipientsRepository,
  PaymentSplitRecipientRow,
} from '../entities/payment-split-recipients-repository.interface';

@Injectable()
export class PaymentSplitRecipientsRepository
  implements IPaymentSplitRecipientsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    entity: PaymentSplitRecipientEntity,
  ): Promise<PaymentSplitRecipientEntity> {
    const data: Prisma.PaymentSplitRecipientUncheckedCreateInput = {
      unique_id: entity._id ?? generateUniqueId(),

      payment_split_id: entity.paymentSplitId,
      split_recipient_id: entity.splitRecipientId,

      gateway_recipient_id: entity.gatewayRecipientId,
      gateway_transfer_id: entity.gatewayTransferId,

      role: entity.role ?? 'secondary',
      amount: entity.amount,
      percentage:
        entity.percentage === null
          ? null
          : new Prisma.Decimal(String(entity.percentage)),
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

    const model = await this.prisma.paymentSplitRecipient.create({
      data,
    });

    const fresh = new PaymentSplitRecipientEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;

    fresh.paymentSplitId = model.payment_split_id;
    fresh.splitRecipientId = model.split_recipient_id;

    fresh.gatewayRecipientId = model.gateway_recipient_id;
    fresh.gatewayTransferId = model.gateway_transfer_id;

    fresh.role = model.role;
    fresh.amount = model.amount;
    fresh.percentage =
      model.percentage === null ? null : Number(model.percentage.toString());
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
  ): Promise<PaymentSplitRecipientRow> {
    const updateData: Prisma.PaymentSplitRecipientUncheckedUpdateInput = {};

    if (
      data.gateway_recipient_id !== undefined &&
      data.gateway_recipient_id !== null
    ) {
      updateData.gateway_recipient_id = String(data.gateway_recipient_id);
    }

    if (
      data.gateway_transfer_id !== undefined &&
      data.gateway_transfer_id !== null
    ) {
      updateData.gateway_transfer_id = String(data.gateway_transfer_id);
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

    const model = await this.prisma.paymentSplitRecipient.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async getAllByPaymentSplitId(
    paymentSplitId: string,
  ): Promise<PaymentSplitRecipientRow[]> {
    const rows = await this.prisma.paymentSplitRecipient.findMany({
      where: {
        payment_split_id: paymentSplitId,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  private toRow(model: {
    id: number;
    unique_id: string;

    payment_split_id: string;
    split_recipient_id: string;

    gateway_recipient_id: string | null;
    gateway_transfer_id: string | null;

    role: string;
    amount: number;
    percentage: Prisma.Decimal | null;
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
  }): PaymentSplitRecipientRow {
    return {
      id: model.id,
      _id: model.unique_id,

      paymentSplitId: model.payment_split_id,
      splitRecipientId: model.split_recipient_id,

      gatewayRecipientId: model.gateway_recipient_id,
      gatewayTransferId: model.gateway_transfer_id,

      role: model.role,
      amount: model.amount,
      percentage:
        model.percentage === null ? null : Number(model.percentage.toString()),
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
