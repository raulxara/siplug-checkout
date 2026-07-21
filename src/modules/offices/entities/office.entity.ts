import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import { IOfficesRepository } from './offices-repository.interface';

export class OfficeEntity extends AbstractEntity {
  public name!: string;
  public slug!: string;
  public language: string | null = null;
  public currency: string | null = null;

  public addressStreet: string | null = null;
  public addressNumber: string | null = null;
  public addressComplement: string | null = null;
  public addressNeighborhood: string | null = null;
  public addressCity: string | null = null;
  public addressState: string | null = null;
  public addressCountry: string | null = null;

  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: IOfficesRepository) {
    super();
  }

  async create(): Promise<OfficeEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,
      name: fresh.name,
      slug: fresh.slug,
      language: fresh.language,
      currency: fresh.currency,
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