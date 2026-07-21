import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IPositionPermissionsRepository } from './position-permissions-repository.interface';

export class PositionPermissionEntity extends AbstractEntity {
  public positionId!: string;
  public permissionId!: string;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: IPositionPermissionsRepository) {
    super();
  }

  async create(): Promise<PositionPermissionEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,
      positionId: fresh.positionId,
      permissionId: fresh.permissionId,
      config: fresh.config,
      changesHistory: fresh.changesHistory,
      status: fresh.status,
      createdAt: fresh.createdAt,
      updatedAt: fresh.updatedAt,
    });

    return this;
  }
}