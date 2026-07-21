import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { GatewayEntity } from '../entities/gateway.entity';
import type {
  GatewayRow,
  IGatewaysRepository,
} from '../entities/gateways-repository.interface';

@Injectable()
export class GatewaysRepository implements IGatewaysRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: GatewayEntity): Promise<GatewayEntity> {
    const model = await this.prisma.gateway.create({
      data: {
        unique_id: entity._id ?? generateUniqueId(),
        name: entity.name,
        slug: entity.slug,
        provider: entity.provider,
        description: entity.description,
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

    const fresh = new GatewayEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;
    fresh.name = model.name;
    fresh.slug = model.slug;
    fresh.provider = model.provider;
    fresh.description = model.description;
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
  ): Promise<GatewayRow> {
    const updateData: Prisma.GatewayUncheckedUpdateInput = {};

    if (data.name !== undefined && data.name !== null) {
      updateData.name = String(data.name);
    }

    if (data.slug !== undefined && data.slug !== null) {
      updateData.slug = String(data.slug);
    }

    if (data.provider !== undefined && data.provider !== null) {
      updateData.provider = String(data.provider);
    }

    if (data.description !== undefined && data.description !== null) {
      updateData.description = String(data.description);
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

    const model = await this.prisma.gateway.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<GatewayRow | null> {
    const model = await this.prisma.gateway.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findBySlug(slug: string): Promise<GatewayRow | null> {
    const model = await this.prisma.gateway.findFirst({
      where: {
        slug,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<GatewayRow[]> {
    const rows = await this.prisma.gateway.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  private toRow(model: {
    id: number;
    unique_id: string;
    name: string;
    slug: string;
    provider: string;
    description: string | null;
    config: Prisma.JsonValue | null;
    changes_history: Prisma.JsonValue | null;
    status: string;
    created_at: Date;
    updated_at: Date;
  }): GatewayRow {
    return {
      id: model.id,
      _id: model.unique_id,
      name: model.name,
      slug: model.slug,
      provider: model.provider,
      description: model.description,
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