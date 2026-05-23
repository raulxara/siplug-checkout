import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { PositionPermissionEntity } from '../entities/position-permission.entity';
import type {
  IPositionPermissionsRepository,
  PositionPermissionRow,
} from '../entities/position-permissions-repository.interface';

@Injectable()
export class PositionPermissionsRepository
  implements IPositionPermissionsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    entity: PositionPermissionEntity,
  ): Promise<PositionPermissionEntity> {
    const data: Prisma.PositionPermissionUncheckedCreateInput = {
      unique_id: entity._id ?? generateUniqueId(),
      position_id: entity.positionId,
      permission_id: entity.permissionId,
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

    const model = await this.prisma.positionPermission.create({
      data,
    });

    const fresh = new PositionPermissionEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;
    fresh.positionId = model.position_id;
    fresh.permissionId = model.permission_id;
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
  ): Promise<PositionPermissionRow> {
    const updateData: Prisma.PositionPermissionUncheckedUpdateInput = {};

    if (data.position_id !== undefined && data.position_id !== null) {
      updateData.position_id = String(data.position_id);
    }

    if (data.permission_id !== undefined && data.permission_id !== null) {
      updateData.permission_id = String(data.permission_id);
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

    const model = await this.prisma.positionPermission.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(
    _id: string,
  ): Promise<PositionPermissionRow | null> {
    const model = await this.prisma.positionPermission.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findByPositionAndPermission(
    positionId: string,
    permissionId: string,
  ): Promise<PositionPermissionRow | null> {
    const model = await this.prisma.positionPermission.findFirst({
      where: {
        position_id: positionId,
        permission_id: permissionId,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<PositionPermissionRow[]> {
    const rows = await this.prisma.positionPermission.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByPositionId(
    positionId: string,
  ): Promise<PositionPermissionRow[]> {
    const rows = await this.prisma.positionPermission.findMany({
      where: {
        position_id: positionId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByPositionIds(
    positionIds: string[],
  ): Promise<PositionPermissionRow[]> {
    const rows = await this.prisma.positionPermission.findMany({
      where: {
        position_id: {
          in: positionIds,
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
    position_id: string;
    permission_id: string;
    config: Prisma.JsonValue | null;
    changes_history: Prisma.JsonValue | null;
    status: string;
    created_at: Date;
    updated_at: Date;
  }): PositionPermissionRow {
    return {
      id: model.id,
      _id: model.unique_id,
      positionId: model.position_id,
      permissionId: model.permission_id,
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