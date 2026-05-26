import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { PaymentCustomerEntity } from '../entities/payment-customer.entity';
import type {
  IPaymentCustomersRepository,
  PaymentCustomerRow,
} from '../entities/payment-customers-repository.interface';

@Injectable()
export class PaymentCustomersRepository implements IPaymentCustomersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: PaymentCustomerEntity): Promise<PaymentCustomerEntity> {
    const model = await this.prisma.paymentCustomer.create({
      data: {
        unique_id: entity._id ?? generateUniqueId(),
        office_id: entity.officeId,
        client_id: entity.clientId,
        profile_id: entity.profileId,
        external_reference: entity.externalReference,
        name: entity.name,
        email: entity.email,
        document_type: entity.documentType,
        document_value: entity.documentValue,
        phone: entity.phone,
        billing_address:
          entity.billingAddress === null
            ? Prisma.JsonNull
            : (entity.billingAddress as Prisma.InputJsonValue),
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
      },
    });

    const fresh = new PaymentCustomerEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;
    fresh.officeId = model.office_id;
    fresh.clientId = model.client_id;
    fresh.profileId = model.profile_id;
    fresh.externalReference = model.external_reference;
    fresh.name = model.name;
    fresh.email = model.email;
    fresh.documentType = model.document_type;
    fresh.documentValue = model.document_value;
    fresh.phone = model.phone;
    fresh.billingAddress = this.parseJsonObject(model.billing_address);
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
  ): Promise<PaymentCustomerRow> {
    const updateData: Prisma.PaymentCustomerUncheckedUpdateInput = {};

    if (data.office_id !== undefined && data.office_id !== null) {
      updateData.office_id = String(data.office_id);
    }

    if (data.client_id !== undefined && data.client_id !== null) {
      updateData.client_id = String(data.client_id);
    }

    if (data.profile_id !== undefined && data.profile_id !== null) {
      updateData.profile_id = String(data.profile_id);
    }

    if (
      data.external_reference !== undefined &&
      data.external_reference !== null
    ) {
      updateData.external_reference = String(data.external_reference);
    }

    if (data.name !== undefined && data.name !== null) {
      updateData.name = String(data.name);
    }

    if (data.email !== undefined && data.email !== null) {
      updateData.email = String(data.email);
    }

    if (data.document_type !== undefined && data.document_type !== null) {
      updateData.document_type = String(data.document_type);
    }

    if (data.document_value !== undefined && data.document_value !== null) {
      updateData.document_value = String(data.document_value);
    }

    if (data.phone !== undefined && data.phone !== null) {
      updateData.phone = String(data.phone);
    }

    if (data.billing_address !== undefined && data.billing_address !== null) {
      updateData.billing_address =
        data.billing_address as Prisma.InputJsonValue;
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

    const model = await this.prisma.paymentCustomer.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<PaymentCustomerRow | null> {
    const model = await this.prisma.paymentCustomer.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<PaymentCustomerRow[]> {
    const rows = await this.prisma.paymentCustomer.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  async getAllByOfficeId(officeId: string): Promise<PaymentCustomerRow[]> {
    const rows = await this.prisma.paymentCustomer.findMany({
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
    profile_id: string | null;
    external_reference: string | null;
    name: string;
    email: string | null;
    document_type: string | null;
    document_value: string | null;
    phone: string | null;
    billing_address: Prisma.JsonValue | null;
    metadata: Prisma.JsonValue | null;
    config: Prisma.JsonValue | null;
    changes_history: Prisma.JsonValue | null;
    status: string;
    created_at: Date;
    updated_at: Date;
  }): PaymentCustomerRow {
    return {
      id: model.id,
      _id: model.unique_id,
      officeId: model.office_id,
      clientId: model.client_id,
      profileId: model.profile_id,
      externalReference: model.external_reference,
      name: model.name,
      email: model.email,
      documentType: model.document_type,
      documentValue: model.document_value,
      phone: model.phone,
      billingAddress: this.parseJsonObject(model.billing_address),
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