import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { ProfileEntity } from '../entities/profile.entity';
import {
  IProfilesRepository,
  ProfileRow,
} from '../entities/profiles-repository.interface';

@Injectable()
export class ProfilesRepository implements IProfilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: ProfileEntity): Promise<ProfileEntity> {
    const model = await this.prisma.profile.create({
      data: {
        unique_id: entity._id ?? generateUniqueId(),
        first_name: entity.firstName,
        last_name: entity.lastName,
        email: entity.email,
        phone: entity.phone,
        document_type: entity.documentType,
        document_value: entity.documentValue,
        address_street: entity.addressStreet,
        address_number: entity.addressNumber,
        address_complement: entity.addressComplement,
        address_neighborhood: entity.addressNeighborhood,
        address_city: entity.addressCity,
        address_state: entity.addressState,
        address_country: entity.addressCountry,
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

    const fresh = new ProfileEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;
    fresh.firstName = model.first_name;
    fresh.lastName = model.last_name;
    fresh.email = model.email;
    fresh.phone = model.phone;
    fresh.documentType = model.document_type;
    fresh.documentValue = model.document_value;
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
  ): Promise<ProfileRow> {
    const updateData: Prisma.ProfileUpdateInput = {};

    if (data.first_name !== undefined && data.first_name !== null) {
      updateData.first_name = String(data.first_name);
    }

    if (data.last_name !== undefined && data.last_name !== null) {
      updateData.last_name = String(data.last_name);
    }

    if (data.email !== undefined && data.email !== null) {
      updateData.email = String(data.email);
    }

    if (data.phone !== undefined && data.phone !== null) {
      updateData.phone = String(data.phone);
    }

    if (data.document_type !== undefined && data.document_type !== null) {
      updateData.document_type = String(data.document_type);
    }

    if (data.document_value !== undefined && data.document_value !== null) {
      updateData.document_value = String(data.document_value);
    }

    if (data.address_street !== undefined && data.address_street !== null) {
      updateData.address_street = String(data.address_street);
    }

    if (data.address_number !== undefined && data.address_number !== null) {
      updateData.address_number = String(data.address_number);
    }

    if (
      data.address_complement !== undefined &&
      data.address_complement !== null
    ) {
      updateData.address_complement = String(data.address_complement);
    }

    if (
      data.address_neighborhood !== undefined &&
      data.address_neighborhood !== null
    ) {
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

    const model = await this.prisma.profile.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<ProfileRow | null> {
    const model = await this.prisma.profile.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findByEmail(email: string): Promise<ProfileRow | null> {
    const model = await this.prisma.profile.findFirst({
      where: {
        email,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findByDocument(
    documentType: string,
    documentValue: string,
  ): Promise<ProfileRow | null> {
    const model = await this.prisma.profile.findFirst({
      where: {
        document_type: documentType,
        document_value: documentValue,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAll(): Promise<ProfileRow[]> {
    const rows = await this.prisma.profile.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  private toRow(model: {
    id: number;
    unique_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    document_type: string | null;
    document_value: string | null;
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
  }): ProfileRow {
    return {
      id: model.id,
      _id: model.unique_id,
      firstName: model.first_name,
      lastName: model.last_name,
      email: model.email,
      phone: model.phone,
      documentType: model.document_type,
      documentValue: model.document_value,
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