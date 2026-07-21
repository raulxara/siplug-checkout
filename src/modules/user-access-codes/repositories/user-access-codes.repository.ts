import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { UserAccessCodeEntity } from '../entities/user-access-code.entity';
import type {
  IUserAccessCodesRepository,
  UserAccessCodeRow,
} from '../entities/user-access-codes-repository.interface';

@Injectable()
export class UserAccessCodesRepository
  implements IUserAccessCodesRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    entity: UserAccessCodeEntity,
  ): Promise<UserAccessCodeEntity> {
    const expiresAt =
      entity.expiresAt === null
        ? new Date(Date.now() + 15 * 60 * 1000)
        : new Date(entity.expiresAt);

    const model = await this.prisma.userAccessCode.create({
      data: {
        unique_id: entity._id ?? generateUniqueId(),

        // Campo real no Prisma: user_id
        user_id: entity.userCustomerId,

        // Campo real no Prisma: type
        type: entity.channel,

        // Campo real no Prisma: sent_to
        sent_to: entity.destination,

        code: entity.code,

        // expires_at é obrigatório no schema atual
        expires_at: expiresAt,

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

    const fresh = new UserAccessCodeEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;
    fresh.userCustomerId = model.user_id;
    fresh.channel = model.type;
    fresh.destination = model.sent_to;
    fresh.code = model.code;
    fresh.expiresAt = formatDateTime(model.expires_at);

    // Estes campos ainda não existem na tabela atual.
    fresh.usedAt = null;
    fresh.sentAt = null;

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
  ): Promise<UserAccessCodeRow> {
    const updateData: Prisma.UserAccessCodeUncheckedUpdateInput = {};

    if (data.user_customer_id !== undefined && data.user_customer_id !== null) {
      updateData.user_id = String(data.user_customer_id);
    }

    if (data.user_id !== undefined && data.user_id !== null) {
      updateData.user_id = String(data.user_id);
    }

    if (data.channel !== undefined && data.channel !== null) {
      updateData.type = String(data.channel);
    }

    if (data.type !== undefined && data.type !== null) {
      updateData.type = String(data.type);
    }

    if (data.destination !== undefined && data.destination !== null) {
      updateData.sent_to = String(data.destination);
    }

    if (data.sent_to !== undefined && data.sent_to !== null) {
      updateData.sent_to = String(data.sent_to);
    }

    if (data.code !== undefined && data.code !== null) {
      updateData.code = String(data.code);
    }

    if (data.expires_at !== undefined && data.expires_at !== null) {
      updateData.expires_at = new Date(String(data.expires_at));
    }

    /**
     * used_at e sent_at ainda não existem no schema Prisma atual.
     * Por isso, não atualizamos esses campos aqui.
     * Quando a migration/schema for evoluída, adicionamos o mapeamento.
     */

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

    const model = await this.prisma.userAccessCode.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<UserAccessCodeRow | null> {
    const model = await this.prisma.userAccessCode.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findByCode(code: string): Promise<UserAccessCodeRow | null> {
    const model = await this.prisma.userAccessCode.findFirst({
      where: {
        code,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAllByUserCustomerId(
    userCustomerId: string,
  ): Promise<UserAccessCodeRow[]> {
    const rows = await this.prisma.userAccessCode.findMany({
      where: {
        user_id: userCustomerId,
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
    user_id: string;
    type: string;
    sent_to: string;
    code: string;
    expires_at: Date;
    config: Prisma.JsonValue | null;
    changes_history: Prisma.JsonValue | null;
    status: string;
    created_at: Date;
    updated_at: Date;
  }): UserAccessCodeRow {
    return {
      id: model.id,
      _id: model.unique_id,

      // Mantemos camelCase no domínio, mapeando do schema real.
      userCustomerId: model.user_id,
      channel: model.type,
      destination: model.sent_to,

      code: model.code,
      expiresAt: formatDateTime(model.expires_at),

      // Campos ainda inexistentes na tabela atual.
      usedAt: null,
      sentAt: null,

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