import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { SubscriptionCycleEntity } from '../entities/subscription-cycle.entity';
import type {
  ISubscriptionCyclesRepository,
  SubscriptionCycleRow,
} from '../entities/subscription-cycles-repository.interface';

@Injectable()
export class SubscriptionCyclesRepository
  implements ISubscriptionCyclesRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    entity: SubscriptionCycleEntity,
  ): Promise<SubscriptionCycleEntity> {
    const model = await this.prisma.subscriptionCycle.create({
      data: {
        unique_id: entity._id ?? generateUniqueId(),

        subscription_id: entity.subscriptionId,
        cycle_number: entity.cycleNumber,

        amount: entity.amount,
        currency: entity.currency,

        period_start: this.toNullableDate(entity.periodStart),
        period_end: this.toNullableDate(entity.periodEnd),
        scheduled_at: this.toNullableDate(entity.scheduledAt),
        processed_at: this.toNullableDate(entity.processedAt),

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

        status: entity.status ?? 'scheduled',
      },
    });

    const fresh = new SubscriptionCycleEntity(this);
    this.hydrateEntityFromModel(fresh, model);

    return fresh;
  }

  async updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<SubscriptionCycleRow> {
    const updateData: Prisma.SubscriptionCycleUncheckedUpdateInput = {};

    if (data.subscription_id !== undefined && data.subscription_id !== null) {
      updateData.subscription_id = String(data.subscription_id);
    }

    if (data.cycle_number !== undefined && data.cycle_number !== null) {
      updateData.cycle_number = Number(data.cycle_number);
    }

    if (data.amount !== undefined && data.amount !== null) {
      updateData.amount = Number(data.amount);
    }

    if (data.currency !== undefined && data.currency !== null) {
      updateData.currency = String(data.currency);
    }

    if (data.period_start !== undefined && data.period_start !== null) {
      updateData.period_start = this.toNullableDate(String(data.period_start));
    }

    if (data.period_end !== undefined && data.period_end !== null) {
      updateData.period_end = this.toNullableDate(String(data.period_end));
    }

    if (data.scheduled_at !== undefined && data.scheduled_at !== null) {
      updateData.scheduled_at = this.toNullableDate(String(data.scheduled_at));
    }

    if (data.processed_at !== undefined && data.processed_at !== null) {
      updateData.processed_at = this.toNullableDate(String(data.processed_at));
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

    const model = await this.prisma.subscriptionCycle.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<SubscriptionCycleRow | null> {
    const model = await this.prisma.subscriptionCycle.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findBySubscriptionIdAndCycleNumber(params: {
    subscriptionId: string;
    cycleNumber: number;
  }): Promise<SubscriptionCycleRow | null> {
    const model = await this.prisma.subscriptionCycle.findFirst({
      where: {
        subscription_id: params.subscriptionId,
        cycle_number: params.cycleNumber,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAllBySubscriptionId(
    subscriptionId: string,
  ): Promise<SubscriptionCycleRow[]> {
    const rows = await this.prisma.subscriptionCycle.findMany({
      where: {
        subscription_id: subscriptionId,
      },
      orderBy: {
        cycle_number: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  private hydrateEntityFromModel(
    entity: SubscriptionCycleEntity,
    model: SubscriptionCyclePrismaModel,
  ): void {
    const row = this.toRow(model);

    entity.id = row.id;
    entity._id = row._id;

    entity.subscriptionId = row.subscriptionId;
    entity.cycleNumber = row.cycleNumber;

    entity.amount = row.amount;
    entity.currency = row.currency;

    entity.periodStart = row.periodStart;
    entity.periodEnd = row.periodEnd;
    entity.scheduledAt = row.scheduledAt;
    entity.processedAt = row.processedAt;

    entity.metadata = row.metadata;
    entity.config = row.config;
    entity.changesHistory = row.changesHistory;

    entity.status = row.status;
    entity.createdAt = row.createdAt;
    entity.updatedAt = row.updatedAt;
  }

  private toRow(model: SubscriptionCyclePrismaModel): SubscriptionCycleRow {
    return {
      id: model.id,
      _id: model.unique_id,

      subscriptionId: model.subscription_id,
      cycleNumber: model.cycle_number,

      amount: model.amount,
      currency: model.currency,

      periodStart: model.period_start ? formatDateTime(model.period_start) : null,
      periodEnd: model.period_end ? formatDateTime(model.period_end) : null,
      scheduledAt: model.scheduled_at ? formatDateTime(model.scheduled_at) : null,
      processedAt: model.processed_at ? formatDateTime(model.processed_at) : null,

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

type SubscriptionCyclePrismaModel = {
  id: number;
  unique_id: string;

  subscription_id: string;
  cycle_number: number;

  amount: number;
  currency: string;

  period_start: Date | null;
  period_end: Date | null;
  scheduled_at: Date | null;
  processed_at: Date | null;

  metadata: Prisma.JsonValue | null;
  config: Prisma.JsonValue | null;
  changes_history: Prisma.JsonValue | null;

  status: string;

  created_at: Date;
  updated_at: Date | null;
};