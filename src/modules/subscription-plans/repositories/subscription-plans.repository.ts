import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { SubscriptionPlanEntity } from '../entities/subscription-plan.entity';
import type {
  ISubscriptionPlansRepository,
  SubscriptionPlanRow,
} from '../entities/subscription-plans-repository.interface';

@Injectable()
export class SubscriptionPlansRepository
  implements ISubscriptionPlansRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    entity: SubscriptionPlanEntity,
  ): Promise<SubscriptionPlanEntity> {
    const model = await this.prisma.subscriptionPlan.create({
      data: {
        unique_id: entity._id ?? generateUniqueId(),

        office_id: entity.officeId,
        client_id: entity.clientId,

        gateway_id: entity.gatewayId,
        api_credential_id: entity.apiCredentialId,
        gateway_plan_id: entity.gatewayPlanId,

        name: entity.name,
        slug: entity.slug,
        description: entity.description,

        amount: entity.amount,
        currency: entity.currency,

        interval_type: entity.billingInterval,
        interval_count: entity.billingIntervalCount,

        trial_days: entity.trialDays,
        max_billing_cycles: entity.maxBillingCycles,

        payment_methods:
          entity.paymentMethods === null
            ? Prisma.JsonNull
            : (entity.paymentMethods as Prisma.InputJsonValue),

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

        status: entity.status ?? 'active',
      },
    });

    const fresh = new SubscriptionPlanEntity(this);

    this.hydrateEntityFromModel(fresh, model);

    return fresh;
  }

  async updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<SubscriptionPlanRow> {
    const updateData: Prisma.SubscriptionPlanUncheckedUpdateInput = {};

    if (data.office_id !== undefined && data.office_id !== null) {
      updateData.office_id = String(data.office_id);
    }

    if (data.client_id !== undefined && data.client_id !== null) {
      updateData.client_id = String(data.client_id);
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

    if (data.gateway_plan_id !== undefined && data.gateway_plan_id !== null) {
      updateData.gateway_plan_id = String(data.gateway_plan_id);
    }

    if (data.name !== undefined && data.name !== null) {
      updateData.name = String(data.name);
    }

    if (data.slug !== undefined && data.slug !== null) {
      updateData.slug = String(data.slug);
    }

    if (data.description !== undefined && data.description !== null) {
      updateData.description = String(data.description);
    }

    if (data.amount !== undefined && data.amount !== null) {
      updateData.amount = Number(data.amount);
    }

    if (data.currency !== undefined && data.currency !== null) {
      updateData.currency = String(data.currency);
    }

    if (data.interval_type !== undefined && data.interval_type !== null) {
      updateData.interval_type = String(data.interval_type);
    }

    if (data.interval_count !== undefined && data.interval_count !== null) {
      updateData.interval_count = Number(data.interval_count);
    }

    if (data.trial_days !== undefined && data.trial_days !== null) {
      updateData.trial_days = Number(data.trial_days);
    }

    if (
      data.max_billing_cycles !== undefined &&
      data.max_billing_cycles !== null
    ) {
      updateData.max_billing_cycles = Number(data.max_billing_cycles);
    }

    if (
      data.payment_methods !== undefined &&
      data.payment_methods !== null
    ) {
      updateData.payment_methods =
        data.payment_methods as Prisma.InputJsonValue;
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

    const model = await this.prisma.subscriptionPlan.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<SubscriptionPlanRow | null> {
    const model = await this.prisma.subscriptionPlan.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findBySlugAndOfficeId(params: {
    slug: string;
    officeId: string;
  }): Promise<SubscriptionPlanRow | null> {
    const model = await this.prisma.subscriptionPlan.findFirst({
      where: {
        slug: params.slug,
        office_id: params.officeId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<SubscriptionPlanRow[]> {
    const rows = await this.prisma.subscriptionPlan.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByOfficeId(officeId: string): Promise<SubscriptionPlanRow[]> {
    const rows = await this.prisma.subscriptionPlan.findMany({
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
    entity: SubscriptionPlanEntity,
    model: SubscriptionPlanPrismaModel,
  ): void {
    const row = this.toRow(model);

    entity.id = row.id;
    entity._id = row._id;

    entity.officeId = row.officeId;
    entity.clientId = row.clientId;

    entity.gatewayId = row.gatewayId;
    entity.apiCredentialId = row.apiCredentialId;
    entity.gatewayPlanId = row.gatewayPlanId;

    entity.name = row.name;
    entity.slug = row.slug;
    entity.description = row.description;

    entity.billingInterval = row.billingInterval;
    entity.billingIntervalCount = row.billingIntervalCount;

    entity.amount = row.amount;
    entity.currency = row.currency;

    entity.trialDays = row.trialDays;
    entity.maxBillingCycles = row.maxBillingCycles;

    entity.paymentMethods = row.paymentMethods;
    entity.metadata = row.metadata;
    entity.config = row.config;
    entity.changesHistory = row.changesHistory;

    entity.status = row.status;
    entity.createdAt = row.createdAt;
    entity.updatedAt = row.updatedAt;
  }

  private toRow(model: SubscriptionPlanPrismaModel): SubscriptionPlanRow {
    return {
      id: model.id,
      _id: model.unique_id,

      officeId: model.office_id,
      clientId: model.client_id,

      gatewayId: model.gateway_id,
      apiCredentialId: model.api_credential_id,
      gatewayPlanId: model.gateway_plan_id,

      name: model.name,
      slug: model.slug,
      description: model.description,

      billingInterval: model.interval_type,
      billingIntervalCount: model.interval_count,

      amount: model.amount,
      currency: model.currency,

      trialDays: model.trial_days,
      maxBillingCycles: model.max_billing_cycles,

      paymentMethods: this.parseStringArray(model.payment_methods),
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

  private parseStringArray(value: Prisma.JsonValue | null): string[] | null {
    if (!Array.isArray(value)) {
      return null;
    }

    return value.map((item) => String(item));
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

type SubscriptionPlanPrismaModel = {
  id: number;
  unique_id: string;

  office_id: string;
  client_id: string;

  gateway_id: string | null;
  api_credential_id: string | null;
  gateway_plan_id: string | null;

  name: string;
  slug: string;
  description: string | null;

  amount: number;
  currency: string;

  interval_type: string;
  interval_count: number;

  trial_days: number | null;
  max_billing_cycles: number | null;

  payment_methods: Prisma.JsonValue | null;
  metadata: Prisma.JsonValue | null;
  config: Prisma.JsonValue | null;
  changes_history: Prisma.JsonValue | null;

  status: string;

  created_at: Date;
  updated_at: Date | null;
};
