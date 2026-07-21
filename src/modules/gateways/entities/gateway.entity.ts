import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IGatewaysRepository } from './gateways-repository.interface';

export class GatewayEntity extends AbstractEntity {
  public name!: string;
  public slug!: string;
  public provider!: string;
  public description: string | null = null;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: IGatewaysRepository) {
    super();
  }

  async create(): Promise<GatewayEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,
      name: fresh.name,
      slug: fresh.slug,
      provider: fresh.provider,
      description: fresh.description,
      config: fresh.config,
      changesHistory: fresh.changesHistory,
      status: fresh.status,
      createdAt: fresh.createdAt,
      updatedAt: fresh.updatedAt,
    });

    return this;
  }
}