import type { PositionPermissionEntity } from '../../../entities/position-permission.entity';

export class CreatePositionPermissionDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly positionId: string,
    public readonly permissionId: string,
    public readonly config: Record<string, unknown> | null,
    public readonly changesHistory: Array<Record<string, unknown>> | null,
    public readonly status: string,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}

  static fromEntity(
    entity: PositionPermissionEntity,
  ): CreatePositionPermissionDtoOut {
    return new CreatePositionPermissionDtoOut(
      entity.id ?? 0,
      entity._id ?? '',
      entity.positionId,
      entity.permissionId,
      entity.config,
      entity.changesHistory,
      entity.status ?? 'active',
      entity.createdAt,
      entity.updatedAt,
    );
  }
}