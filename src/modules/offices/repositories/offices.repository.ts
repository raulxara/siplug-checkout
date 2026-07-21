import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { OfficeEntity } from '../entities/office.entity';
import {
  IOfficesRepository,
  OfficeRow,
} from '../entities/offices-repository.interface';

@Injectable()
export class OfficesRepository implements IOfficesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: OfficeEntity): Promise<OfficeEntity> {
    const model = await this.prisma.office.create({
      data: {
        unique_id: entity._id ?? generateUniqueId(),
        name: entity.name,
        slug: entity.slug,
        language: entity.language,
        currency: entity.currency,
        address_street: entity.addressStreet,
        address_number: entity.addressNumber,
        address_complement: entity.addressComplement,
        address_neighborhood: entity.addressNeighborhood,
        address_city: entity.addressCity,
        address_state: entity.addressState,
        address_country: entity.addressCountry,
        config: entity.config as Prisma.InputJsonValue,
        changes_history: entity.changesHistory as Prisma.InputJsonValue,
        status: entity.status ?? 'active',
      },
    });

    const fresh = new OfficeEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;
    fresh.name = model.name;
    fresh.slug = model.slug;
    fresh.language = model.language;
    fresh.currency = model.currency;
    fresh.addressStreet = model.address_street;
    fresh.addressNumber = model.address_number;
    fresh.addressComplement = model.address_complement;
    fresh.addressNeighborhood = model.address_neighborhood;
    fresh.addressCity = model.address_city;
    fresh.addressState = model.address_state;
    fresh.addressCountry = model.address_country;
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
  ): Promise<OfficeRow> {
    const updateData: Prisma.OfficeUpdateInput = {};

    if (data.name !== undefined && data.name !== null) {
      updateData.name = String(data.name);
    }

    if (data.slug !== undefined && data.slug !== null) {
      updateData.slug = String(data.slug);
    }

    if (data.language !== undefined && data.language !== null) {
        updateData.language = String(data.language);
    }

    if (data.currency !== undefined && data.currency !== null) {
      updateData.currency = String(data.currency);
    }

    if (data.address_street !== undefined && data.address_street !== null) {
      updateData.address_street = String(data.address_street);
    }

    if (data.address_number !== undefined && data.address_number !== null) {
      updateData.address_number = String(data.address_number);
    }

    if (data.address_complement !== undefined && data.address_complement !== null) {
      updateData.address_complement = String(data.address_complement);
    }

    if (data.address_neighborhood !== undefined && data.address_neighborhood !== null) {
      updateData.address_neighborhood = String(data.address_neighborhood);
    }

    if (data.address_city !== undefined && data.address_city !== null) {
      updateData.address_city = String(data.address_city);
    }

    if (data.address_state !== undefined && data.address_state !== null) {
      updateData.address_state = String(data.address_state);
    }

    if (data.address_country !== undefined && data.address_country !== null) {
      updateData.address_country = String(data.address_country);
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

    const model = await this.prisma.office.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<OfficeRow | null> {
    const model = await this.prisma.office.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findBySlug(slug: string): Promise<OfficeRow | null> {
    const model = await this.prisma.office.findFirst({
      where: {
        slug,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<OfficeRow[]> {
    const rows = await this.prisma.office.findMany({
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
    language: string | null;
    currency: string | null;
    address_street: string | null;
    address_number: string | null;
    address_complement: string | null;
    address_neighborhood: string | null;
    address_city: string | null;
    address_state: string | null;
    address_country: string | null;
    config: Prisma.JsonValue | null;
    changes_history: Prisma.JsonValue | null;
    status: string;
    created_at: Date;
    updated_at: Date;
  }): OfficeRow {
    return {
      id: model.id,
      _id: model.unique_id,
      name: model.name,
      slug: model.slug,
      language: model.language,
      currency: model.currency,
      addressStreet: model.address_street,
      addressNumber: model.address_number,
      addressComplement: model.address_complement,
      addressNeighborhood: model.address_neighborhood,
      addressCity: model.address_city,
      addressState: model.address_state,
      addressCountry: model.address_country,
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