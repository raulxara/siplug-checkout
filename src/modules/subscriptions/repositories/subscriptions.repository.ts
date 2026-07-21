import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { SubscriptionEntity } from '../entities/subscription.entity';
import type {
  ISubscriptionsRepository,
  SubscriptionRow,
} from '../entities/subscriptions-repository.interface';

@Injectable()
export class SubscriptionsRepository implements ISubscriptionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: SubscriptionEntity): Promise<SubscriptionEntity> {
    const model = await this.prisma.subscription.create({
      data: {
        unique_id: entity._id ?? generateUniqueId(),

        office_id: entity.officeId,
        client_id: entity.clientId,

        subscription_plan_id: entity.subscriptionPlanId,
        payment_customer_id: entity.paymentCustomerId,

        gateway_id: entity.gatewayId,
        api_credential_id: entity.apiCredentialId,

        gateway_subscription_id: entity.gatewaySubscriptionId,
        external_reference: entity.externalReference,

        amount: entity.amount,
        currency: entity.currency,

        current_cycle: entity.currentCycle,

        next_billing_at: this.toNullableDate(entity.nextBillingAt),
        started_at: this.toNullableDate(entity.startedAt),
        canceled_at: this.toNullableDate(entity.canceledAt),
        ended_at: this.toNullableDate(entity.endedAt),

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

    const fresh = new SubscriptionEntity(this);

    this.hydrateEntityFromModel(fresh, model);

    return fresh;
  }

  async updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<SubscriptionRow> {
    const updateData: Prisma.SubscriptionUncheckedUpdateInput = {};

    if (data.office_id !== undefined && data.office_id !== null) {
      updateData.office_id = String(data.office_id);
    }

    if (data.client_id !== undefined && data.client_id !== null) {
      updateData.client_id = String(data.client_id);
    }

    if (
      data.subscription_plan_id !== undefined &&
      data.subscription_plan_id !== null
    ) {
      updateData.subscription_plan_id = String(data.subscription_plan_id);
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

    if (
      data.gateway_subscription_id !== undefined &&
      data.gateway_subscription_id !== null
    ) {
      updateData.gateway_subscription_id = String(
        data.gateway_subscription_id,
      );
    }

    if (
      data.external_reference !== undefined &&
      data.external_reference !== null
    ) {
      updateData.external_reference = String(data.external_reference);
    }

    if (data.amount !== undefined && data.amount !== null) {
      updateData.amount = Number(data.amount);
    }

    if (data.currency !== undefined && data.currency !== null) {
      updateData.currency = String(data.currency);
    }

    if (data.current_cycle !== undefined && data.current_cycle !== null) {
      updateData.current_cycle = Number(data.current_cycle);
    }

    if (
      data.next_billing_at !== undefined &&
      data.next_billing_at !== null
    ) {
      updateData.next_billing_at = this.toNullableDate(
        String(data.next_billing_at),
      );
    }

    if (data.started_at !== undefined && data.started_at !== null) {
      updateData.started_at = this.toNullableDate(String(data.started_at));
    }

    if (data.canceled_at !== undefined && data.canceled_at !== null) {
      updateData.canceled_at = this.toNullableDate(String(data.canceled_at));
    }

    if (data.ended_at !== undefined && data.ended_at !== null) {
      updateData.ended_at = this.toNullableDate(String(data.ended_at));
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

    const model = await this.prisma.subscription.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<SubscriptionRow | null> {
    const model = await this.prisma.subscription.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findByExternalReferenceAndOfficeId(params: {
    externalReference: string;
    officeId: string;
  }): Promise<SubscriptionRow | null> {
    const model = await this.prisma.subscription.findFirst({
      where: {
        external_reference: params.externalReference,
        office_id: params.officeId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<SubscriptionRow[]> {
    const rows = await this.prisma.subscription.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByOfficeId(officeId: string): Promise<SubscriptionRow[]> {
    const rows = await this.prisma.subscription.findMany({
      where: {
        office_id: officeId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  private hydrateEntityFromModel(
    entity: SubscriptionEntity,
    model: SubscriptionPrismaModel,
  ): void {
    const row = this.toRow(model);

    entity.id = row.id;
    entity._id = row._id;

    entity.officeId = row.officeId;
    entity.clientId = row.clientId;

    entity.subscriptionPlanId = row.subscriptionPlanId;
    entity.paymentCustomerId = row.paymentCustomerId;

    entity.gatewayId = row.gatewayId;
    entity.apiCredentialId = row.apiCredentialId;

    entity.gatewaySubscriptionId = row.gatewaySubscriptionId;
    entity.externalReference = row.externalReference;

    entity.amount = row.amount;
    entity.currency = row.currency;

    entity.currentCycle = row.currentCycle;

    entity.nextBillingAt = row.nextBillingAt;
    entity.startedAt = row.startedAt;
    entity.canceledAt = row.canceledAt;
    entity.endedAt = row.endedAt;

    entity.metadata = row.metadata;
    entity.config = row.config;
    entity.changesHistory = row.changesHistory;

    entity.status = row.status;
    entity.createdAt = row.createdAt;
    entity.updatedAt = row.updatedAt;
  }

  private toRow(model: SubscriptionPrismaModel): SubscriptionRow {
    return {
      id: model.id,
      _id: model.unique_id,

      officeId: model.office_id,
      clientId: model.client_id,

      subscriptionPlanId: model.subscription_plan_id,
      paymentCustomerId: model.payment_customer_id,

      gatewayId: model.gateway_id,
      apiCredentialId: model.api_credential_id,

      gatewaySubscriptionId: model.gateway_subscription_id,
      externalReference: model.external_reference,

      amount: model.amount,
      currency: model.currency,

      currentCycle: model.current_cycle,

      nextBillingAt: model.next_billing_at
        ? formatDateTime(model.next_billing_at)
        : null,
      startedAt: model.started_at ? formatDateTime(model.started_at) : null,
      canceledAt: model.canceled_at ? formatDateTime(model.canceled_at) : null,
      endedAt: model.ended_at ? formatDateTime(model.ended_at) : null,

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

type SubscriptionPrismaModel = {
  id: number;
  unique_id: string;

  office_id: string;
  client_id: string;

  subscription_plan_id: string | null;
  payment_customer_id: string;

  gateway_id: string | null;
  api_credential_id: string | null;

  gateway_subscription_id: string | null;
  external_reference: string | null;

  amount: number;
  currency: string;

  current_cycle: number;

  next_billing_at: Date | null;
  started_at: Date | null;
  canceled_at: Date | null;
  ended_at: Date | null;

  metadata: Prisma.JsonValue | null;
  config: Prisma.JsonValue | null;
  changes_history: Prisma.JsonValue | null;

  status: string;

  created_at: Date;
  updated_at: Date | null;
};