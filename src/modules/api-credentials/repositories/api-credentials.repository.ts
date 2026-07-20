import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { ApiCredentialEntity } from '../entities/api-credential.entity';
import type {
  ApiCredentialRow,
  IApiCredentialsRepository,
} from '../entities/api-credentials-repository.interface';

@Injectable()
export class ApiCredentialsRepository implements IApiCredentialsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: ApiCredentialEntity): Promise<ApiCredentialEntity> {
    const model = await this.prisma.apiCredential.create({
      data: {
        unique_id: entity._id ?? generateUniqueId(),
        office_id: entity.officeId,
        client_id: entity.clientId,
        gateway_id: entity.gatewayId,
        name: entity.name,
        slug: entity.slug,
        provider: entity.provider,
        provider_type: entity.providerType,
        environment: entity.environment,
        token: entity.token,
        origin: entity.origin,
        config:
          entity.config === null
            ? Prisma.JsonNull
            : (entity.config as Prisma.InputJsonValue),
        expires_at:
          entity.expiresAt === null ? null : new Date(entity.expiresAt),
        changes_history:
          entity.changesHistory === null
            ? Prisma.JsonNull
            : (entity.changesHistory as Prisma.InputJsonValue),
        status: entity.status ?? 'active',
      },
    });

    const fresh = new ApiCredentialEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;
    fresh.officeId = model.office_id;
    fresh.clientId = model.client_id;
    fresh.gatewayId = model.gateway_id;
    fresh.name = model.name;
    fresh.slug = model.slug;
    fresh.provider = model.provider;
    fresh.providerType = model.provider_type;
    fresh.environment = model.environment;
    fresh.token = model.token;
    fresh.origin = model.origin;
    fresh.config = this.parseJsonObject(model.config);
    fresh.expiresAt = formatDateTime(model.expires_at);
    fresh.changesHistory = this.parseChangesHistory(model.changes_history);
    fresh.status = model.status;
    fresh.createdAt = formatDateTime(model.created_at);
    fresh.updatedAt = formatDateTime(model.updated_at);

    return fresh;
  }

  async updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<ApiCredentialRow> {
    const updateData: Prisma.ApiCredentialUncheckedUpdateInput = {};

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

    if (data.provider !== undefined && data.provider !== null) {
      updateData.provider = String(data.provider);
    }

    if (data.provider_type !== undefined && data.provider_type !== null) {
      updateData.provider_type = String(data.provider_type);
    }

    if (data.environment !== undefined && data.environment !== null) {
      updateData.environment = String(data.environment);
    }

    if (data.token !== undefined && data.token !== null) {
      updateData.token = String(data.token);
    }

    if (data.origin !== undefined && data.origin !== null) {
      updateData.origin = String(data.origin);
    }

    if (data.config !== undefined && data.config !== null) {
      updateData.config = data.config as Prisma.InputJsonValue;
    }

    if (data.expires_at !== undefined && data.expires_at !== null) {
      updateData.expires_at = new Date(String(data.expires_at));
    }

    if (data.changes_history !== undefined && data.changes_history !== null) {
      updateData.changes_history =
        data.changes_history as Prisma.InputJsonValue;
    }

    if (data.status !== undefined && data.status !== null) {
      updateData.status = String(data.status);
    }

    const model = await this.prisma.apiCredential.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<ApiCredentialRow | null> {
    const model = await this.prisma.apiCredential.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAllByOfficeId(officeId: string): Promise<ApiCredentialRow[]> {
    const rows = await this.prisma.apiCredential.findMany({
      where: {
        office_id: officeId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async findBySlug(slug: string): Promise<ApiCredentialRow | null> {
    const model = await this.prisma.apiCredential.findFirst({
      where: {
        slug,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findByOfficeIdAndSlug(
    officeId: string | null,
    slug: string,
  ): Promise<ApiCredentialRow | null> {
    const model = await this.prisma.apiCredential.findFirst({
      where: {
        office_id: officeId,
        slug,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<ApiCredentialRow[]> {
    const rows = await this.prisma.apiCredential.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByClientId(clientId: string): Promise<ApiCredentialRow[]> {
    const rows = await this.prisma.apiCredential.findMany({
      where: {
        client_id: clientId,
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
    client_id: string | null;
    gateway_id: string | null;
    name: string;
    slug: string;
    provider: string;
    provider_type: string;
    environment: string;
    token: string | null;
    origin: string | null;
    config: Prisma.JsonValue | null;
    expires_at: Date | null;
    changes_history: Prisma.JsonValue | null;
    status: string;
    created_at: Date;
    updated_at: Date;
  }): ApiCredentialRow {
    return {
      id: model.id,
      _id: model.unique_id,
      officeId: model.office_id,
      clientId: model.client_id,
      gatewayId: model.gateway_id,
      name: model.name,
      slug: model.slug,
      provider: model.provider,
      providerType: model.provider_type,
      environment: model.environment,
      token: model.token,
      origin: model.origin,
      config: this.parseJsonObject(model.config),
      expiresAt: formatDateTime(model.expires_at),
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