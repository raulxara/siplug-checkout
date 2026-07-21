import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { SplitRuleEntity } from '../entities/split-rule.entity';
import type {
  ISplitRulesRepository,
  SplitRuleRow,
} from '../entities/split-rules-repository.interface';

@Injectable()
export class SplitRulesRepository implements ISplitRulesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: SplitRuleEntity): Promise<SplitRuleEntity> {
    const data: Prisma.SplitRuleUncheckedCreateInput = {
      unique_id: entity._id ?? generateUniqueId(),

      office_id: entity.officeId,
      client_id: entity.clientId,
      gateway_id: entity.gatewayId,

      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      split_type: entity.splitType,
      calculation_base: entity.calculationBase ?? 'gross_amount',
      priority: entity.priority ?? 0,

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
    };

    const model = await this.prisma.splitRule.create({
      data,
    });

    const fresh = new SplitRuleEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;

    fresh.officeId = model.office_id;
    fresh.clientId = model.client_id;
    fresh.gatewayId = model.gateway_id;

    fresh.name = model.name;
    fresh.slug = model.slug;
    fresh.description = model.description;
    fresh.splitType = model.split_type;
    fresh.calculationBase = model.calculation_base;
    fresh.priority = model.priority;

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
  ): Promise<SplitRuleRow> {
    const updateData: Prisma.SplitRuleUncheckedUpdateInput = {};

    if (data.office_id !== undefined && data.office_id !== null) {
      updateData.office_id = String(data.office_id);
    }

    if (data.client_id !== undefined && data.client_id !== null) {
      updateData.client_id = String(data.client_id);
    }

    if (data.gateway_id !== undefined && data.gateway_id !== null) {
      updateData.gateway_id = String(data.gateway_id);
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

    if (data.split_type !== undefined && data.split_type !== null) {
      updateData.split_type = String(data.split_type);
    }

    if (
      data.calculation_base !== undefined &&
      data.calculation_base !== null
    ) {
      updateData.calculation_base = String(data.calculation_base);
    }

    if (data.priority !== undefined && data.priority !== null) {
      updateData.priority = Number(data.priority);
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

    const model = await this.prisma.splitRule.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<SplitRuleRow | null> {
    const model = await this.prisma.splitRule.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findByOfficeIdAndSlug(
    officeId: string,
    slug: string,
  ): Promise<SplitRuleRow | null> {
    const model = await this.prisma.splitRule.findFirst({
      where: {
        office_id: officeId,
        slug,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<SplitRuleRow[]> {
    const rows = await this.prisma.splitRule.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByOfficeId(officeId: string): Promise<SplitRuleRow[]> {
    const rows = await this.prisma.splitRule.findMany({
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
    gateway_id: string | null;

    name: string;
    slug: string;
    description: string | null;
    split_type: string;
    calculation_base: string;
    priority: number;

    metadata: Prisma.JsonValue | null;
    config: Prisma.JsonValue | null;
    changes_history: Prisma.JsonValue | null;

    status: string;
    created_at: Date;
    updated_at: Date;
  }): SplitRuleRow {
    return {
      id: model.id,
      _id: model.unique_id,

      officeId: model.office_id,
      clientId: model.client_id,
      gatewayId: model.gateway_id,

      name: model.name,
      slug: model.slug,
      description: model.description,
      splitType: model.split_type,
      calculationBase: model.calculation_base,
      priority: model.priority,

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
