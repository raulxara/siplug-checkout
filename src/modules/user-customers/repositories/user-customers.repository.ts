import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { UserCustomerEntity } from '../entities/user-customer.entity';
import type {
  IUserCustomersRepository,
  UserCustomerRow,
} from '../entities/user-customers-repository.interface';

@Injectable()
export class UserCustomersRepository implements IUserCustomersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: UserCustomerEntity): Promise<UserCustomerEntity> {
    const data: Prisma.UserCustomerUncheckedCreateInput = {
      unique_id: entity._id ?? generateUniqueId(),
      client_id: entity.clientId,
      profile_id: entity.profileId,
      token: entity.token,
      two_fa_required: entity.twoFaRequired,
      two_fa_active: entity.twoFaActive,
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

    const model = await this.prisma.userCustomer.create({
      data,
    });

    const fresh = new UserCustomerEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;
    fresh.clientId = model.client_id;
    fresh.profileId = model.profile_id;
    fresh.token = model.token;
    fresh.twoFaRequired = model.two_fa_required;
    fresh.twoFaActive = model.two_fa_active;
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
  ): Promise<UserCustomerRow> {
    const updateData: Prisma.UserCustomerUncheckedUpdateInput = {};

    if (data.client_id !== undefined && data.client_id !== null) {
      updateData.client_id = String(data.client_id);
    }

    if (data.profile_id !== undefined && data.profile_id !== null) {
      updateData.profile_id = String(data.profile_id);
    }

    if (data.token !== undefined && data.token !== null) {
      updateData.token = String(data.token);
    }

    if (
      data.two_fa_required !== undefined &&
      data.two_fa_required !== null
    ) {
      updateData.two_fa_required = Boolean(data.two_fa_required);
    }

    if (data.two_fa_active !== undefined && data.two_fa_active !== null) {
      updateData.two_fa_active = Boolean(data.two_fa_active);
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

    const model = await this.prisma.userCustomer.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<UserCustomerRow | null> {
    const model = await this.prisma.userCustomer.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findByToken(token: string): Promise<UserCustomerRow | null> {
    const model = await this.prisma.userCustomer.findUnique({
      where: {
        token,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<UserCustomerRow[]> {
    const rows = await this.prisma.userCustomer.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByClientId(clientId: string): Promise<UserCustomerRow[]> {
    const rows = await this.prisma.userCustomer.findMany({
      where: {
        client_id: clientId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByClientIds(clientIds: string[]): Promise<UserCustomerRow[]> {
    const rows = await this.prisma.userCustomer.findMany({
      where: {
        client_id: {
          in: clientIds,
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
    client_id: string;
    profile_id: string;
    token: string;
    two_fa_required: boolean;
    two_fa_active: boolean;
    config: Prisma.JsonValue | null;
    changes_history: Prisma.JsonValue | null;
    status: string;
    created_at: Date;
    updated_at: Date;
  }): UserCustomerRow {
    return {
      id: model.id,
      _id: model.unique_id,
      clientId: model.client_id,
      profileId: model.profile_id,
      token: model.token,
      twoFaRequired: model.two_fa_required,
      twoFaActive: model.two_fa_active,
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