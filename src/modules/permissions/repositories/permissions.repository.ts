import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { PermissionEntity } from '../entities/permission.entity';
import type {
  IPermissionsRepository,
  PermissionRow,
} from '../entities/permissions-repository.interface';

@Injectable()
export class PermissionsRepository implements IPermissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: PermissionEntity): Promise<PermissionEntity> {
    const data: Prisma.PermissionUncheckedCreateInput = {
      unique_id: entity._id ?? generateUniqueId(),
      office_id: entity.officeId,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      entity: entity.entity,
      action: entity.action,
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

    const model = await this.prisma.permission.create({
      data,
    });

    const fresh = new PermissionEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;
    fresh.officeId = model.office_id;
    fresh.name = model.name;
    fresh.slug = model.slug;
    fresh.description = model.description;
    fresh.entity = model.entity;
    fresh.action = model.action;
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
  ): Promise<PermissionRow> {
    const updateData: Prisma.PermissionUncheckedUpdateInput = {};

    if (data.name !== undefined && data.name !== null) {
      updateData.name = String(data.name);
    }

    if (data.slug !== undefined && data.slug !== null) {
      updateData.slug = String(data.slug);
    }

    if (data.description !== undefined && data.description !== null) {
      updateData.description = String(data.description);
    }

    if (data.config !== undefined && data.config !== null) {
      updateData.config = data.config as Prisma.InputJsonValue;
    }

    const changesHistory = data.changes_history ?? data.changesHistory;

    if (changesHistory !== undefined && changesHistory !== null) {
      updateData.changes_history = changesHistory as Prisma.InputJsonValue;
    }

    if (data.status !== undefined && data.status !== null) {
      updateData.status = String(data.status);
    }

    const model = await this.prisma.permission.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<PermissionRow | null> {
    const model = await this.prisma.permission.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAllByOfficeId(officeId: string): Promise<PermissionRow[]> {
    const rows = await this.prisma.permission.findMany({
      where: {
        office_id: officeId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async findBySlug(
    officeId: string | null,
    slug: string,
  ): Promise<PermissionRow | null> {
    const model = await this.prisma.permission.findFirst({
      where: {
        office_id: officeId,
        slug,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<PermissionRow[]> {
    const rows = await this.prisma.permission.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByUniqueIds(_ids: string[]): Promise<PermissionRow[]> {
    const rows = await this.prisma.permission.findMany({
        where: {
        unique_id: {
            in: _ids,
        },
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
    office_id: string | null;
    name: string;
    slug: string;
    description: string | null;
    entity: string;
    action: string;
    config: Prisma.JsonValue | null;
    changes_history: Prisma.JsonValue | null;
    status: string;
    created_at: Date;
    updated_at: Date;
  }): PermissionRow {
    return {
      id: model.id,
      _id: model.unique_id,
      officeId: model.office_id,
      name: model.name,
      slug: model.slug,
      description: model.description,
      entity: model.entity,
      action: model.action,
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