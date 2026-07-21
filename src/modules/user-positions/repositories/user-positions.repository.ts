import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { UserPositionEntity } from '../entities/user-position.entity';
import type {
  IUserPositionsRepository,
  UserPositionRow,
} from '../entities/user-positions-repository.interface';

@Injectable()
export class UserPositionsRepository implements IUserPositionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: UserPositionEntity): Promise<UserPositionEntity> {
    const data: Prisma.UserPositionUncheckedCreateInput = {
      unique_id: entity._id ?? generateUniqueId(),
      user_customer_id: entity.userCustomerId,
      position_id: entity.positionId,
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

    const model = await this.prisma.userPosition.create({
      data,
    });

    const fresh = new UserPositionEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;
    fresh.userCustomerId = model.user_customer_id;
    fresh.positionId = model.position_id;
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
  ): Promise<UserPositionRow> {
    const updateData: Prisma.UserPositionUncheckedUpdateInput = {};

    if (data.user_customer_id !== undefined && data.user_customer_id !== null) {
      updateData.user_customer_id = String(data.user_customer_id);
    }

    if (data.position_id !== undefined && data.position_id !== null) {
      updateData.position_id = String(data.position_id);
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

    const model = await this.prisma.userPosition.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<UserPositionRow | null> {
    const model = await this.prisma.userPosition.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findByUserCustomerAndPosition(
    userCustomerId: string,
    positionId: string,
  ): Promise<UserPositionRow | null> {
    const model = await this.prisma.userPosition.findFirst({
      where: {
        user_customer_id: userCustomerId,
        position_id: positionId,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<UserPositionRow[]> {
    const rows = await this.prisma.userPosition.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByUserCustomerId(
    userCustomerId: string,
  ): Promise<UserPositionRow[]> {
    const rows = await this.prisma.userPosition.findMany({
      where: {
        user_customer_id: userCustomerId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByUserCustomerIds(
    userCustomerIds: string[],
  ): Promise<UserPositionRow[]> {
    const rows = await this.prisma.userPosition.findMany({
      where: {
        user_customer_id: {
          in: userCustomerIds,
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
    user_customer_id: string;
    position_id: string;
    config: Prisma.JsonValue | null;
    changes_history: Prisma.JsonValue | null;
    status: string;
    created_at: Date;
    updated_at: Date;
  }): UserPositionRow {
    return {
      id: model.id,
      _id: model.unique_id,
      userCustomerId: model.user_customer_id,
      positionId: model.position_id,
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