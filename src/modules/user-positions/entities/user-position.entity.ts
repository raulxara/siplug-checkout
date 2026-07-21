import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IUserPositionsRepository } from './user-positions-repository.interface';

export class UserPositionEntity extends AbstractEntity {
  public userCustomerId!: string;
  public positionId!: string;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: IUserPositionsRepository) {
    super();
  }

  async create(): Promise<UserPositionEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,
      userCustomerId: fresh.userCustomerId,
      positionId: fresh.positionId,
      config: fresh.config,
      changesHistory: fresh.changesHistory,
      status: fresh.status,
      createdAt: fresh.createdAt,
      updatedAt: fresh.updatedAt,
    });

    return this;
  }
}