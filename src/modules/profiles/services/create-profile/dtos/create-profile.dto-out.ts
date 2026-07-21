import { ProfileEntity } from '../../../entities/profile.entity';

export class CreateProfileDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly documentType: string | null,
    public readonly documentValue: string | null,
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

  static fromEntity(entity: ProfileEntity): CreateProfileDtoOut {
    return new CreateProfileDtoOut(
      entity.id ?? 0,
      entity._id ?? '',
      entity.firstName,
      entity.lastName,
      entity.email,
      entity.phone,
      entity.documentType,
      entity.documentValue,
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