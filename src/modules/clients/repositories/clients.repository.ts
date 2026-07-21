import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { ClientEntity } from '../entities/client.entity';
import type {
  ClientRow,
  IClientsRepository,
} from '../entities/clients-repository.interface';

@Injectable()
export class ClientsRepository implements IClientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: ClientEntity): Promise<ClientEntity> {
    const data: Prisma.ClientUncheckedCreateInput = {
      unique_id: entity._id ?? generateUniqueId(),
      office_id: entity.officeId,
      customer_id: entity.customerId,
      user_type: entity.userType,
      username: entity.username,
      password: entity.password,
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

    const model = await this.prisma.client.create({
      data,
    });

    const fresh = new ClientEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;
    fresh.officeId = model.office_id;
    fresh.customerId = model.customer_id;
    fresh.userType = model.user_type;
    fresh.username = model.username;
    fresh.password = model.password;
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
  ): Promise<ClientRow> {
    const updateData: Prisma.ClientUncheckedUpdateInput = {};

    if (data.office_id !== undefined && data.office_id !== null) {
      updateData.office_id = String(data.office_id);
    }

    if (data.customer_id !== undefined && data.customer_id !== null) {
      updateData.customer_id = String(data.customer_id);
    }

    if (data.user_type !== undefined && data.user_type !== null) {
      updateData.user_type = String(data.user_type);
    }

    if (data.username !== undefined && data.username !== null) {
      updateData.username = String(data.username);
    }

    if (data.password !== undefined && data.password !== null) {
      updateData.password = String(data.password);
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

    const model = await this.prisma.client.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<ClientRow | null> {
    const model = await this.prisma.client.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findByUsername(username: string): Promise<ClientRow | null> {
    const model = await this.prisma.client.findFirst({
      where: {
        username,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<ClientRow[]> {
    const rows = await this.prisma.client.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByOfficeId(officeId: string): Promise<ClientRow[]> {
    const rows = await this.prisma.client.findMany({
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
    office_id: string | null;
    customer_id: string | null;
    user_type: string;
    username: string;
    config: Prisma.JsonValue | null;
    changes_history: Prisma.JsonValue | null;
    status: string;
    created_at: Date;
    updated_at: Date;
  }): ClientRow {
    return {
      id: model.id,
      _id: model.unique_id,
      officeId: model.office_id,
      customerId: model.customer_id,
      userType: model.user_type,
      username: model.username,
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