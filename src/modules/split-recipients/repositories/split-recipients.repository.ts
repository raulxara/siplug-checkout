import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { SplitRecipientEntity } from '../entities/split-recipient.entity';
import type {
  ISplitRecipientsRepository,
  SplitRecipientRow,
} from '../entities/split-recipients-repository.interface';

@Injectable()
export class SplitRecipientsRepository implements ISplitRecipientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: SplitRecipientEntity): Promise<SplitRecipientEntity> {
    const data: Prisma.SplitRecipientUncheckedCreateInput = {
      unique_id: entity._id ?? generateUniqueId(),

      office_id: entity.officeId,
      client_id: entity.clientId,
      gateway_id: entity.gatewayId,
      api_credential_id: entity.apiCredentialId,

      name: entity.name,
      document_type: entity.documentType,
      document_value: entity.documentValue,
      email: entity.email,

      gateway_provider: entity.gatewayProvider,
      gateway_recipient_id: entity.gatewayRecipientId,
      gateway_account_id: entity.gatewayAccountId,

      bank_data:
        entity.bankData === null
          ? Prisma.JsonNull
          : (entity.bankData as Prisma.InputJsonValue),

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

    const model = await this.prisma.splitRecipient.create({
      data,
    });

    const fresh = new SplitRecipientEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;

    fresh.officeId = model.office_id;
    fresh.clientId = model.client_id;
    fresh.gatewayId = model.gateway_id;
    fresh.apiCredentialId = model.api_credential_id;

    fresh.name = model.name;
    fresh.documentType = model.document_type;
    fresh.documentValue = model.document_value;
    fresh.email = model.email;

    fresh.gatewayProvider = model.gateway_provider;
    fresh.gatewayRecipientId = model.gateway_recipient_id;
    fresh.gatewayAccountId = model.gateway_account_id;

    fresh.bankData = this.parseJsonObject(model.bank_data);
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
  ): Promise<SplitRecipientRow> {
    const updateData: Prisma.SplitRecipientUncheckedUpdateInput = {};

    if (data.office_id !== undefined && data.office_id !== null) {
      updateData.office_id = String(data.office_id);
    }

    if (data.client_id !== undefined && data.client_id !== null) {
      updateData.client_id = String(data.client_id);
    }

    if (data.gateway_id !== undefined && data.gateway_id !== null) {
      updateData.gateway_id = String(data.gateway_id);
    }

    if (
      data.api_credential_id !== undefined &&
      data.api_credential_id !== null
    ) {
      updateData.api_credential_id = String(data.api_credential_id);
    }

    if (data.name !== undefined && data.name !== null) {
      updateData.name = String(data.name);
    }

    if (data.document_type !== undefined && data.document_type !== null) {
      updateData.document_type = String(data.document_type);
    }

    if (data.document_value !== undefined && data.document_value !== null) {
      updateData.document_value = String(data.document_value);
    }

    if (data.email !== undefined && data.email !== null) {
      updateData.email = String(data.email);
    }

    if (data.gateway_provider !== undefined && data.gateway_provider !== null) {
      updateData.gateway_provider = String(data.gateway_provider);
    }

    if (
      data.gateway_recipient_id !== undefined &&
      data.gateway_recipient_id !== null
    ) {
      updateData.gateway_recipient_id = String(data.gateway_recipient_id);
    }

    if (
      data.gateway_account_id !== undefined &&
      data.gateway_account_id !== null
    ) {
      updateData.gateway_account_id = String(data.gateway_account_id);
    }

    if (data.bank_data !== undefined && data.bank_data !== null) {
      updateData.bank_data = data.bank_data as Prisma.InputJsonValue;
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

    const model = await this.prisma.splitRecipient.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<SplitRecipientRow | null> {
    const model = await this.prisma.splitRecipient.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findByGatewayRecipientId(
    gatewayProvider: string,
    gatewayRecipientId: string,
  ): Promise<SplitRecipientRow | null> {
    const model = await this.prisma.splitRecipient.findFirst({
      where: {
        gateway_provider: gatewayProvider,
        gateway_recipient_id: gatewayRecipientId,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<SplitRecipientRow[]> {
    const rows = await this.prisma.splitRecipient.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByOfficeId(officeId: string): Promise<SplitRecipientRow[]> {
    const rows = await this.prisma.splitRecipient.findMany({
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
    api_credential_id: string | null;

    name: string;
    document_type: string | null;
    document_value: string | null;
    email: string | null;

    gateway_provider: string | null;
    gateway_recipient_id: string | null;
    gateway_account_id: string | null;

    bank_data: Prisma.JsonValue | null;
    metadata: Prisma.JsonValue | null;
    config: Prisma.JsonValue | null;
    changes_history: Prisma.JsonValue | null;

    status: string;
    created_at: Date;
    updated_at: Date;
  }): SplitRecipientRow {
    return {
      id: model.id,
      _id: model.unique_id,

      officeId: model.office_id,
      clientId: model.client_id,
      gatewayId: model.gateway_id,
      apiCredentialId: model.api_credential_id,

      name: model.name,
      documentType: model.document_type,
      documentValue: model.document_value,
      email: model.email,

      gatewayProvider: model.gateway_provider,
      gatewayRecipientId: model.gateway_recipient_id,
      gatewayAccountId: model.gateway_account_id,

      bankData: this.parseJsonObject(model.bank_data),
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