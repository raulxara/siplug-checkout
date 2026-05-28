import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { CheckoutSessionEntity } from '../entities/checkout-session.entity';
import type {
  CheckoutSessionRow,
  ICheckoutSessionsRepository,
} from '../entities/checkout-sessions-repository.interface';

@Injectable()
export class CheckoutSessionsRepository
  implements ICheckoutSessionsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    entity: CheckoutSessionEntity,
  ): Promise<CheckoutSessionEntity> {
    const model = await this.prisma.checkoutSession.create({
      data: {
        unique_id: entity._id ?? generateUniqueId(),

        office_id: entity.officeId,
        client_id: entity.clientId,
        payment_customer_id: entity.paymentCustomerId ?? undefined,
        gateway_id: entity.gatewayId ?? undefined,
        api_credential_id: entity.apiCredentialId ?? undefined,

        code: entity.code,
        external_reference: entity.externalReference,
        idempotency_key: entity.idempotencyKey,

        payment_type: entity.paymentType,
        amount: entity.amount,
        currency: entity.currency,
        description: entity.description,

        success_url: entity.successUrl,
        cancel_url: entity.cancelUrl,
        expires_at: entity.expiresAt ? new Date(entity.expiresAt) : null,

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

    const fresh = new CheckoutSessionEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;

    fresh.officeId = model.office_id;
    fresh.clientId = model.client_id;
    fresh.paymentCustomerId = model.payment_customer_id;
    fresh.gatewayId = model.gateway_id;
    fresh.apiCredentialId = model.api_credential_id;

    fresh.code = model.code;
    fresh.externalReference = model.external_reference;
    fresh.idempotencyKey = model.idempotency_key;

    fresh.paymentType = model.payment_type;
    fresh.amount = model.amount;
    fresh.currency = model.currency;
    fresh.description = model.description;

    fresh.successUrl = model.success_url;
    fresh.cancelUrl = model.cancel_url;
    fresh.expiresAt = model.expires_at ? formatDateTime(model.expires_at) : null;

    fresh.metadata = this.parseJsonObject(model.metadata);
    fresh.config = this.parseJsonObject(model.config);
    fresh.changesHistory = this.parseChangesHistory(model.changes_history);

    fresh.status = model.status;
    fresh.createdAt = formatDateTime(model.created_at);
    fresh.updatedAt = model.updated_at ? formatDateTime(model.updated_at) : null;

    return fresh;
  }

  async updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<CheckoutSessionRow> {
    const updateData: Prisma.CheckoutSessionUncheckedUpdateInput = {};

    if (data.office_id !== undefined && data.office_id !== null) {
      updateData.office_id = String(data.office_id);
    }

    if (data.client_id !== undefined && data.client_id !== null) {
      updateData.client_id = String(data.client_id);
    }

    if (
      data.payment_customer_id !== undefined &&
      data.payment_customer_id !== null
    ) {
      updateData.payment_customer_id = String(data.payment_customer_id);
    }

    if (data.gateway_id !== undefined && data.gateway_id !== null) {
      updateData.gateway_id = String(data.gateway_id);
    }

    if (
      data.api_credential_id !== undefined &&
      data.api_credential_id !== null
    ) {
      updateData.api_credential_id = String(data.api_credential_id);
    }

    if (data.code !== undefined && data.code !== null) {
      updateData.code = String(data.code);
    }

    if (
      data.external_reference !== undefined &&
      data.external_reference !== null
    ) {
      updateData.external_reference = String(data.external_reference);
    }

    if (
      data.idempotency_key !== undefined &&
      data.idempotency_key !== null
    ) {
      updateData.idempotency_key = String(data.idempotency_key);
    }

    if (data.payment_type !== undefined && data.payment_type !== null) {
      updateData.payment_type = String(data.payment_type);
    }

    if (data.amount !== undefined && data.amount !== null) {
      updateData.amount = Number(data.amount);
    }

    if (data.currency !== undefined && data.currency !== null) {
      updateData.currency = String(data.currency);
    }

    if (data.description !== undefined && data.description !== null) {
      updateData.description = String(data.description);
    }

    if (data.success_url !== undefined && data.success_url !== null) {
      updateData.success_url = String(data.success_url);
    }

    if (data.cancel_url !== undefined && data.cancel_url !== null) {
      updateData.cancel_url = String(data.cancel_url);
    }

    if (data.expires_at !== undefined && data.expires_at !== null) {
      updateData.expires_at = new Date(String(data.expires_at));
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

    const model = await this.prisma.checkoutSession.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<CheckoutSessionRow | null> {
    const model = await this.prisma.checkoutSession.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<CheckoutSessionRow[]> {
    const rows = await this.prisma.checkoutSession.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByOfficeId(officeId: string): Promise<CheckoutSessionRow[]> {
    const rows = await this.prisma.checkoutSession.findMany({
      where: {
        office_id: officeId,
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
    payment_customer_id: string | null;
    gateway_id: string | null;
    api_credential_id: string | null;

    code: string | null;
    external_reference: string | null;
    idempotency_key: string | null;

    payment_type: string;
    amount: number;
    currency: string;
    description: string | null;

    success_url: string | null;
    cancel_url: string | null;
    expires_at: Date | null;

    metadata: Prisma.JsonValue | null;
    config: Prisma.JsonValue | null;
    changes_history: Prisma.JsonValue | null;

    status: string;

    created_at: Date;
    updated_at: Date | null;
  }): CheckoutSessionRow {
    return {
      id: model.id,
      _id: model.unique_id,

      officeId: model.office_id,
      clientId: model.client_id,
      paymentCustomerId: model.payment_customer_id,
      gatewayId: model.gateway_id,
      apiCredentialId: model.api_credential_id,

      code: model.code,
      externalReference: model.external_reference,
      idempotencyKey: model.idempotency_key,

      paymentType: model.payment_type,
      amount: model.amount,
      currency: model.currency,
      description: model.description,

      successUrl: model.success_url,
      cancelUrl: model.cancel_url,
      expiresAt: model.expires_at ? formatDateTime(model.expires_at) : null,

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
}
