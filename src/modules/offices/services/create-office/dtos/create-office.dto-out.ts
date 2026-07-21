import { OfficeEntity } from '../../../entities/office.entity';

export class CreateOfficeDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly language: string | null,
    public readonly currency: string | null,
    public readonly addressStreet: string | null,
    public readonly addressNumber: string | null,
    public readonly addressComplement: string | null,
    public readonly addressNeighborhood: string | null,
    public readonly addressCity: string | null,
    public readonly addressState: string | null,
    public readonly addressCountry: string | null,
    public readonly config: Record<string, unknown> | null,
    public readonly changesHistory: Array<Record<string, unknown>> | null,
    public readonly status: string,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}

  static fromEntity(entity: OfficeEntity): CreateOfficeDtoOut {
    return new CreateOfficeDtoOut(
      entity.id ?? 0,
      entity._id ?? '',
      entity.name,
      entity.slug,
      entity.language,
      entity.currency,
      entity.addressStreet,
      entity.addressNumber,
      entity.addressComplement,
      entity.addressNeighborhood,
      entity.addressCity,
      entity.addressState,
      entity.addressCountry,
      entity.config,
      entity.changesHistory,
      entity.status ?? 'active',
      entity.createdAt,
      entity.updatedAt,
    );
  }
}