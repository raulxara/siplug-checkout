import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IPositionsRepository } from './positions-repository.interface';

export class PositionEntity extends AbstractEntity {
  public officeId: string | null = null;
  public name!: string;
  public slug!: string;
  public description: string | null = null;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: IPositionsRepository) {
    super();
  }

  async create(): Promise<PositionEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,
      officeId: fresh.officeId,
      name: fresh.name,
      slug: fresh.slug,
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