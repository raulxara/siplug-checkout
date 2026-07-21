import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import { IProfilesRepository } from './profiles-repository.interface';

export class ProfileEntity extends AbstractEntity {
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone: string | null = null;

  public documentType: string | null = null;
  public documentValue: string | null = null;

  public addressStreet: string | null = null;
  public addressNumber: string | null = null;
  public addressComplement: string | null = null;
  public addressNeighborhood: string | null = null;
  public addressCity: string | null = null;
  public addressState: string | null = null;
  public addressCountry: string | null = null;

  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: IProfilesRepository) {
    super();
  }

  async create(): Promise<ProfileEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,
      firstName: fresh.firstName,
      lastName: fresh.lastName,
      email: fresh.email,
      phone: fresh.phone,
      documentType: fresh.documentType,
      documentValue: fresh.documentValue,
      addressStreet: fresh.addressStreet,
      addressNumber: fresh.addressNumber,
      addressComplement: fresh.addressComplement,
      addressNeighborhood: fresh.addressNeighborhood,
      addressCity: fresh.addressCity,
      addressState: fresh.addressState,
      addressCountry: fresh.addressCountry,
      config: fresh.config,
      changesHistory: fresh.changesHistory,
      status: fresh.status,
      createdAt: fresh.createdAt,
      updatedAt: fresh.updatedAt,
    });

    return this;
  }
}